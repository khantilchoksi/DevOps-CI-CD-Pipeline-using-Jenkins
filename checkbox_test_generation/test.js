
 var file0 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\server.js');
 var file1 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\admin.js');
 var file2 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\study.js');
 var file3 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\create.js');
var request = require("request");
//var nock = require("nock"); 


request({ url : 'http://localhost:3002/api/design/survey', method: 'POST', json: {"markdown":"\n{NumberQuestions:true}\n-------"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/load/4', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/vote/status', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/status/1', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/listing', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/create', method: 'POST', json: {"invitecode":"RESEARCH","studyKind":"survey"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/create', method: 'POST', json: {"invitecode":"RESEARCH","studyKind":"dataStudy"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/2', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/download/4', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/assign/3', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"1"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"2"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"3"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"4"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"fd284887de896a0a90f803684e9fa23a78f1ff05619c33b1d8930d8f791b61addf8b19125cc64492f783e7fea3c55b9e"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"bd748b8844a225762006dc5eaba62077627b40158bea49eb7f6d6aceeeb5bf76aae50661886784747c0d1f419dc5ab0d"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"5506928127952021d60113a5102711034d024c1dc97641aeca598e98bf96e010a024eb55f20b7efae69e0c7fbcc90a43"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"33a1af4a196ff00a08ca26a07db04d5108af98fd8f6cf1c3e6b2fd5df7461c7613ba4d0832046fdc690bec6612d3812e"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"04ae647b06634e5199a23ca70e7ecb518cacac97cb8982a80b587a242f8581edce2e9fbcfd37fcd5e916287964e861e4"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"725f55c5c79151761fdf01a5c312ad0b4e2eafeb0fef3a7abd65e39b3c62aad331c2e75172e0779d759067f0652375c7"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"ddec18e8fb2b350fb5b22439f3577c564af8745a3e5cec4b0e28942627b172ab2c95f4a58df2c1565f13c37f8852ff79"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"6c31136686b6b2390bbd54f060d326b00b5b1b5df0bb6f1537dd5016e9832d0c11d4cc0fdd1dcfb7d625717924975cf6"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"9759d7b75dc62fbbcd33d124ee04fba0d38f2ffd0f2972ddfb5567ffd31072258429c9e46d63cc0c817a13861b724ad5"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"71cb22774d913a66ff4824c159e361c44608da37545b7035032e16ea8c0d0118a67d71240be64b990a5d6022f3f88bbd"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"746752e2227421f8b6282ee285f2048f5fd61d847dfb4f983404c343676ae6dd23795f301fbef00f5d519f8d7cfb7d75"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"46017e6d1aee0512b4c4d38bd745f3498863ae6a6c77057058b25beea0b6a7261fc28c8d6c2fafc239e256683205f8c5"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"9d3f1b3ca45e06157c04016c4ce486477154ede44b99739bd800bd7e0761821ed62959711ceb95e81296ffc473205d7a"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"c264e9a2fd46c8fd3f08ee6e8287383ca8261cd2a06fcd112d8932d60481ce46ae0d0e7ae458c6c02a748fcd0fbc6357"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"fdd93dcbe749fcf7452c4e1efc78dbc659d041933aaea9263230ef190d25aa781ea711c0ba0d53f118e0385224c6de9e"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"a16baa3f525cdc0d40c1917b990e556c79db2297bd10223bc5ed8f61a30868254497b4ef9c9c31206f09ffab9a6f5ad1"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"d61336c6bfdd278747048aa5db1e74008d2f5d68a3f8683d171501c61879c97936236485e3004c8efb3b8b4cdac4e5ce"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"de2b53a6fc9225717162cec482442623324057f963afa2f5e5db056a7bebba023dc1415470987f75d26148e2787d6b0f"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"d15d31f8cc9d38a8c9607f3860ab8779bbbbb753db91e0a00a4f999e7da06ce1c628ee294968e6f5e4bc51ca24518800"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"c133b8bba9252250c0b66a95e1f56a616c233a33587f1af554e00cb02a3024d9359ff8fccb75f29d63365c0fcdf26da3"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"cb1e7acae256177a5f7854d48b8d9bcf8302511446c05136eb2e79128a3d52925cf970e22184aded39cf5fb18a82bd2f"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"611b46677c2247e03bb76c76834b29e9450fdfff9491b5bba7d8971c55402f2cfcbfd6f2f93454b158ad500bce9e0381"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"885d84f497da0bdc9a238623dee823db8102d05509a45a21fe70743dde9928804685be2f36ce0dd5937bdda7f2f2a897"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"f6c2408d3f126bcf7fd2ab24db50c1571908796104feb3517cd148e6973ec42dcddf1a8e51472a6592be7b2b0e0db4a6"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"da4e4308c4b3607fe77850f2359337249f6311550bec65671ef9f025b337368ebd6f02f5843853f75f27dc3102bdbdea"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"94d3b19e7890050184df6e62f7ec5ab3265aa73d8484205e594c986078f9626180e4037d8e8e981240ecdb854779bdae"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"1673eca5efb5f062c6856324cbe96ae461a5129bd8ea55c923099bd1caec317006de503911572979df8b636cd13daf5d"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"83a00b66a480d5ee85b529b628b007ef32bff8f07363a0e260fdb42784343dab1cca3b9f3e12f721b43c7983950b5b63"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"1"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"2"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"3"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"4"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"fd284887de896a0a90f803684e9fa23a78f1ff05619c33b1d8930d8f791b61addf8b19125cc64492f783e7fea3c55b9e"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"bd748b8844a225762006dc5eaba62077627b40158bea49eb7f6d6aceeeb5bf76aae50661886784747c0d1f419dc5ab0d"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"5506928127952021d60113a5102711034d024c1dc97641aeca598e98bf96e010a024eb55f20b7efae69e0c7fbcc90a43"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"33a1af4a196ff00a08ca26a07db04d5108af98fd8f6cf1c3e6b2fd5df7461c7613ba4d0832046fdc690bec6612d3812e"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"04ae647b06634e5199a23ca70e7ecb518cacac97cb8982a80b587a242f8581edce2e9fbcfd37fcd5e916287964e861e4"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"725f55c5c79151761fdf01a5c312ad0b4e2eafeb0fef3a7abd65e39b3c62aad331c2e75172e0779d759067f0652375c7"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"ddec18e8fb2b350fb5b22439f3577c564af8745a3e5cec4b0e28942627b172ab2c95f4a58df2c1565f13c37f8852ff79"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"6c31136686b6b2390bbd54f060d326b00b5b1b5df0bb6f1537dd5016e9832d0c11d4cc0fdd1dcfb7d625717924975cf6"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"9759d7b75dc62fbbcd33d124ee04fba0d38f2ffd0f2972ddfb5567ffd31072258429c9e46d63cc0c817a13861b724ad5"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"71cb22774d913a66ff4824c159e361c44608da37545b7035032e16ea8c0d0118a67d71240be64b990a5d6022f3f88bbd"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"746752e2227421f8b6282ee285f2048f5fd61d847dfb4f983404c343676ae6dd23795f301fbef00f5d519f8d7cfb7d75"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"46017e6d1aee0512b4c4d38bd745f3498863ae6a6c77057058b25beea0b6a7261fc28c8d6c2fafc239e256683205f8c5"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"9d3f1b3ca45e06157c04016c4ce486477154ede44b99739bd800bd7e0761821ed62959711ceb95e81296ffc473205d7a"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"c264e9a2fd46c8fd3f08ee6e8287383ca8261cd2a06fcd112d8932d60481ce46ae0d0e7ae458c6c02a748fcd0fbc6357"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"fdd93dcbe749fcf7452c4e1efc78dbc659d041933aaea9263230ef190d25aa781ea711c0ba0d53f118e0385224c6de9e"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"a16baa3f525cdc0d40c1917b990e556c79db2297bd10223bc5ed8f61a30868254497b4ef9c9c31206f09ffab9a6f5ad1"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"d61336c6bfdd278747048aa5db1e74008d2f5d68a3f8683d171501c61879c97936236485e3004c8efb3b8b4cdac4e5ce"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"de2b53a6fc9225717162cec482442623324057f963afa2f5e5db056a7bebba023dc1415470987f75d26148e2787d6b0f"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"d15d31f8cc9d38a8c9607f3860ab8779bbbbb753db91e0a00a4f999e7da06ce1c628ee294968e6f5e4bc51ca24518800"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"c133b8bba9252250c0b66a95e1f56a616c233a33587f1af554e00cb02a3024d9359ff8fccb75f29d63365c0fcdf26da3"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"cb1e7acae256177a5f7854d48b8d9bcf8302511446c05136eb2e79128a3d52925cf970e22184aded39cf5fb18a82bd2f"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"611b46677c2247e03bb76c76834b29e9450fdfff9491b5bba7d8971c55402f2cfcbfd6f2f93454b158ad500bce9e0381"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"885d84f497da0bdc9a238623dee823db8102d05509a45a21fe70743dde9928804685be2f36ce0dd5937bdda7f2f2a897"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"f6c2408d3f126bcf7fd2ab24db50c1571908796104feb3517cd148e6973ec42dcddf1a8e51472a6592be7b2b0e0db4a6"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"da4e4308c4b3607fe77850f2359337249f6311550bec65671ef9f025b337368ebd6f02f5843853f75f27dc3102bdbdea"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"94d3b19e7890050184df6e62f7ec5ab3265aa73d8484205e594c986078f9626180e4037d8e8e981240ecdb854779bdae"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"1673eca5efb5f062c6856324cbe96ae461a5129bd8ea55c923099bd1caec317006de503911572979df8b636cd13daf5d"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"83a00b66a480d5ee85b529b628b007ef32bff8f07363a0e260fdb42784343dab1cca3b9f3e12f721b43c7983950b5b63"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"AMZN"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"SURFACE"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"IPADMINI"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"GITHUB"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"BROWSERSTACK"}}
            , function(error, response, body) { console.log(body);} ); 

 setTimeout(function() { file0.server.close(); }, 15000);