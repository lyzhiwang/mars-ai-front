import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateUUID } from '@/utils/helper.js'

export const useAliTtsStore = defineStore('aliTts', () => {
    const ws = ref(null)
    const appkey = ref('')
    const token = ref('')
    const taskId = ref('')
    const isSynthesisStarted = ref(false)
    const audioChunks = ref([])
    const isPlaying = ref(false)
    let audioContext = null

    // 在 App 环境下，安全地获取文件系统管理器
    // #ifdef APP-PLUS
    const fileSystemManager = uni.getFileSystemManager()
    // #endif

    const setCredentials = (key, tkn) => {
        appkey.value = key
        token.value = tkn
    }

    const getHeader = (name = '') => ({
        message_id: generateUUID(),
        task_id: taskId.value,
        namespace: 'FlowingSpeechSynthesizer',
        name,
        appkey: appkey.value,
    })

    const connect = () => {
        return new Promise((resolve, reject) => {
            if (!token.value || !appkey.value) {
                reject('[TTS] token 或 appkey 未设置')
                return
            }
            taskId.value = generateUUID()
            audioChunks.value = []
            ws.value = uni.connectSocket({
                url: `wss://nls-gateway-cn-beijing.aliyuncs.com/ws/v1?token=${token.value}`,
                success: () => console.log('[TTS] 正在连接'),
                fail: (err) => {
                    console.error('[TTS] 连接失败', err)
                    reject(err)
                },
            })

            ws.value.onOpen(() => {
                const startMsg = {
                    header: getHeader('StartSynthesis'),
                    payload: {
                        voice: 'zhixiaoxia',
                        format: 'mp3', // 使用高效的 MP3 格式
                        sample_rate: 24000,
                        volume: 100,
                        speech_rate: 0,
                        pitch_rate: 0,
                        enable_subtitle: true,
                        platform: 'javascript',
                    },
                }
                ws.value.send({ data: JSON.stringify(startMsg) })
            })

            ws.value.onMessage((res) => {
                const data = res.data
                if (typeof data === 'string') {
                    const msg = JSON.parse(data)
                    if (
                        msg.header.name === 'SynthesisStarted' &&
                        msg.header.status === 20000000
                    ) {
                        isSynthesisStarted.value = true
                        resolve()
                    }
                    if (
                        msg.header.name === 'SynthesisCompleted' &&
                        msg.header.status === 20000000
                    ) {
                        isSynthesisStarted.value = false
                        playAudioChunks()
                    }
                } else {
                    audioChunks.value.push(data)
                }
            })

            ws.value.onClose(() => {
                isSynthesisStarted.value = false
                console.log('[TTS] 连接关闭')
            })

            ws.value.onError((err) => {
                isSynthesisStarted.value = false
                console.error('[TTS] 连接错误', err)
                reject(err)
            })
        })
    }

    const playAudioChunks = () => {
        // #ifdef APP-PLUS
        console.log('[TTS] ✅ 采用 getFileSystemManager 方案')
        if (!audioChunks.value.length || isPlaying.value) {
            return
        }
        isPlaying.value = true

        const validBuffers = audioChunks.value.filter(buf => buf instanceof ArrayBuffer)
        if (!validBuffers.length) {
            isPlaying.value = false
            return
        }

        const totalLength = validBuffers.reduce((acc, cur) => acc + cur.byteLength, 0)
        const combinedBuffer = new Uint8Array(totalLength)
        let offset = 0
        validBuffers.forEach((buf) => {
            combinedBuffer.set(new Uint8Array(buf), offset)
            offset += buf.byteLength
        })

        const filePath = `${wx.env.USER_DATA_PATH}/tts_${Date.now()}.mp3`

        // 使用新的 API 写入文件
        fileSystemManager.writeFile({
            filePath: filePath,
            data: combinedBuffer.buffer, // 直接传入 ArrayBuffer
            encoding: 'binary',
            success: () => {
                console.log(`[TTS] ✅ 文件写入成功: ${filePath}`)
                playAudioFile(filePath)
            },
            fail: (err) => {
                console.error('[TTS] ❌ 文件写入失败:', err)
                isPlaying.value = false
                // 写入失败也需要清理
                cleanupAfterPlay(null)
            },
        })
        // #endif
    }

    const playAudioFile = (filePath) => {
        // #ifdef APP-PLUS
        if (audioContext) audioContext.destroy()
        audioContext = uni.createInnerAudioContext()
        audioContext.autoplay = true
        // 新 API 获取的路径可以直接使用
        audioContext.src = filePath

        audioContext.onPlay(() => console.log('[TTS] ▶️ 开始播放音频'))
        audioContext.onEnded(() => { console.log('[TTS] ✅ 音频播放完成'); cleanupAfterPlay(filePath); })
        audioContext.onError((err) => { console.error('[TTS] ❌ 播放错误:', err); cleanupAfterPlay(filePath); })
        audioContext.onStop(() => { console.log('[TTS] ⏹️ 用户停止播放'); cleanupAfterPlay(filePath); })
        // #endif
    }

    const cleanupAfterPlay = (filePath) => {
        // #ifdef APP-PLUS
        if (audioContext) {
            audioContext.destroy()
            audioContext = null
        }
        isPlaying.value = false
        audioChunks.value = []

        if (ws.value) {
            ws.value.close()
            ws.value = null
        }

        // 如果有文件路径（即文件写入成功），则删除文件
        if (filePath) {
            setTimeout(() => {
                fileSystemManager.unlink({
                    filePath: filePath,
                    success: () => console.log('[TTS] 🗑️ 临时文件已删除'),
                    fail: (err) => console.warn('[TTS] 临时文件删除失败:', err),
                })
            }, 500)
        }
        // #endif
    }

    const runSynthesis = (text) => {
        if (!ws.value || !isSynthesisStarted.value) return
        const msg = { header: getHeader('RunSynthesis'), payload: { text } }
        ws.value.send({ data: JSON.stringify(msg) })
    }
    const stopSynthesis = () => {
        if (!ws.value || !isSynthesisStarted.value) return
        const msg = { header: getHeader('StopSynthesis') }
        ws.value.send({ data: JSON.stringify(msg) })
    }
    const disconnect = () => {
        if (ws.value) { ws.value.close(); ws.value = null; }
        if (audioContext) { audioContext.stop(); audioContext.destroy(); audioContext = null; }
        isSynthesisStarted.value = false;
        audioChunks.value = [];
        isPlaying.value = false;
    }

    return { setCredentials, connect, runSynthesis, stopSynthesis, isSynthesisStarted, disconnect }
})