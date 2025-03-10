const baseUrl = 'https://upload-z1.qiniup.com'
const tokenArr = window.location.search.split('=')
const qiniuToken = decodeURIComponent(tokenArr[1])

console.log('qiniuToken', qiniuToken)
const fileNameDom = document.getElementsByClassName('file_name')[0]
const shade = document.getElementById('uploadBox1');
var input = document.getElementById("myFileInput");
    input.addEventListener("change", function() {
      var file = input.files[0];
	  // console.log('file', input.files, file.name)
      uploadFile(file);
    });


var params = {
	id: null,
	web_url: null,
	name: null,
	created_at: null
	// upload_id: null,
	// title: null
}

function uploadFile(file) {
	shade.style.display = "flex"
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", qiniuToken);
  formData.append("x:type", 15);

  fetch(baseUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Upload successful:', JSON.stringify(data));
	if(data.code===0){
		params.web_url = data.data.path
		params.name = data.data.name;
		params.id = data.data.id;
		params.created_at = data.data.created_at;
		shade.style.display = "none";
		fileNameDom.innerText  = `已上传文件: ${data.data.name}`;
		fileNameDom.style.display = "block";
		alert('上传成功!');
	}else{
		shade.style.display = "none";
		alert('上传失败! 请重试。');
	}
  })
  .catch(error => {
    shade.style.display = "none";
    alert('上传失败! 请重试。');
    console.error('Upload error:', error);
  });
}

// const nameInput = document.getElementById("nameInput");
// nameInput.addEventListener("change", function() {
// 	console.log('nameInput',nameInput.value)
// 	params.title = nameInput.value
// });

const btn = document.getElementById("add");
btn.addEventListener("click", function() {
	if(!params.web_url) return alert('请上传文件!')
	uni.postMessage({
	    data: params
	});
	shade.style.display = "none";
	// uni.navigateBack({delta: 2})
});
