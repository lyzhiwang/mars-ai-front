const baseUrl = 'https://upload-z1.qiniup.com'
const tokenArr = window.location.search.split('=')
// console.log('tokenArr',tokenArr[1])
const qiniuToken = decodeURIComponent(tokenArr[1])

// console.log('qiniuToken', qiniuToken)

var input = document.getElementById("myFileInput");
    input.addEventListener("change", function() {
      var file = input.files[0];
      uploadFile(file);
    });

var params = {
	upload_id: null,
	title: null
}

function uploadFile(file){
  let formData = new FormData();
  formData.append("file", file);
  formData.append("token",qiniuToken)
  formData.append("x:type",15)

  var xhr = new XMLHttpRequest();
  xhr.open("POST", baseUrl);
  xhr.send(formData);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      console.log('response',response);
	  params.upload_id = response.data.id
	  alert('上传成功!')
    } else {
		alert('上传失败.请重试!')
      console.log('Error: ' + xhr.status);
    }
  };
}

const nameInput = document.getElementById("nameInput");
nameInput.addEventListener("change", function() {
	console.log('nameInput',nameInput.value)
	params.title = nameInput.value
});

const btn = document.getElementById("add");
btn.addEventListener("click", function() {
	if(!params.upload_id) return alert('请上传音频!')
	if(!params.title) return alert('请填写音频名称!')
	uni.postMessage({
	    data: params
	});
	uni.navigateBack()
	// window.parent.postMessage(params,'*')
});
// var xhr = new XMLHttpRequest();
// xhr.open('GET', `${baseUrl+qiniuUrl}?file_type=audio`, true);
// xhr.onload = function() {
//   if (xhr.status === 200) {
//     var data = JSON.parse(xhr.responseText);
//     console.log(data);
//   } else {
//     console.log('Error: ' + xhr.status);
//   }
// };
// xhr.onreadystatechange = function() {
//   if (xhr.readyState === 4 && xhr.status === 200) {
//     console.log(xhr.responseText);
//   }
// };
// xhr.setRequestHeader('Content-Type', 'application/json');
// xhr.send();
