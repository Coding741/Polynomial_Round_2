# Polynomial_Round_2
1 API: getAuthURL
  URL: http://localhost:5000/googleDrive/getAuthURL 
  METHOD:GET
using this api we get the code form url 
---------------------------------------------------------------
2 API: getToken
  URL: http://localhost:5000/googleDrive/getToken 
  METHOD:POST
  BODY: {
          "code":api1 respone url code
         }
         
---------------------------------------------------------------
3 API: getUserInfo
  URL: http://localhost:5000/googleDrive/getUserInfo 
  METHOD:POST
  BODY: {
            "token":api 2 respone
         }
using this api we can get get user info where we auth. 
---------------------------------------------------------------
4 API: uploadFile
  URL: http://localhost:5000/googleDrive/uploadFile 
  METHOD:POST
  BODY: {
          "filePath":"/home/enjoycode/Downloads/Org Chart Whiteboard in Yellow Red Basic Style.png"
      }
      
pass file path then api will upload this file on goggle drive.
---------------------------------------------------------------


5 API: getDriveDetails
  URL: http://localhost:5000/googleDrive/getDriveDetails 
  METHOD:POST
  BODY:{
    "pageSize":10
}
      
pageSize is how many file data we want  then  we use this api
--------------------------------------------------------------
6 API: shareFile
  URL: http://localhost:5000/googleDrive/shareFile 
  METHOD:POST
  BODY:{
    "fileName":"Org Chart Whiteboard in Yellow Red Basic Style.png",
    "email":"bansi.birajdar7@gmail.com",
    "type":"user",
    "role":"writer"
}
 filename ,email, type and role we pass the data from body  then we will share that file with email which we giveing. 
