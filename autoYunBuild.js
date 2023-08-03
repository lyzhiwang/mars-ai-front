const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const projectDir = 'D:/workSpace/mars-ai-front'
const hbuildxDir = 'D:/waresoft/HBuilderX'
const appDir = `${projectDir}/dist/release/apk`

async function switchBranch(item){
	try{
		const { branch, appName, appid } = item
		// 进入项目目录 & 执行切换分支命令
		await exec(`cd ${projectDir} && git checkout ${branch}`, { stdio:'inherit' });
		console.log(`切换到${branch}分支`)
		// 进入hbuildX目录 & 执行打包命令
		console.log(`--开始打包${branch}--`)
		const res = await exec(`cd ${hbuildxDir}/ &&cli pack --config ${projectDir}/configure.json`, { stdio:'inherit' });
		console.log(`--${branch}打包结束--`)
		// 进入apk目录，重命名
		fs.readdir(appDir, (err, files) => {
			if (err) return console.error(`读取目录出错: ${err}`);
			// 遍历所有文件
			for(let file of files){
				// 获取文件名
				const fileName = path.basename(file);
				// const fileNameWithoutExtension = path.basename(file, path.extname(file));
				// 匹配文件
				if (fileName.includes(appid)) {
					// console.log(1111, path.dirname(file))
					// 重命名文件
					fs.rename(`${appDir}/${fileName}`, `${appDir}/${appName}.apk`, err => {
						if (err) {
							console.error(`重命名文件出错: ${err}`);
						} else {
							console.log(`重命名成功 ${appName}.apk`);
						}
					});
					break;
				}
			}
		});
	}catch(e){
		throw e
	}
}

async function startBuild(branchArr){
	for(let branch of branchArr){
		await switchBranch(branch)
	}
}
const appList = [
	{branch: 'main', appName: 'mars', appid: '__UNI__78B6275'},
	{branch: 'huoju', appName: 'huoju', appid: '__UNI__96C030F'},
	{branch: 'bokeduo', appName: 'bokeduo', appid: '__UNI__7E37250'},
]
startBuild(appList).catch(console.error);