<?php

  //include 'ChromePhp.php';
  
  //ChromePhp::log('123');

  header('Content-Type:"text/javascript"');
   
   $jsondata=json_encode(['http://localhost:2083/server/jsonp.phphttp://localhost:2083/server/jsonp.phphttp://localhost:2083/server/jsonp.phphttp://localhost:2083/server/jsonp.phphttp://localhost:2083/server/jsonp.phphttp://localhost:2083/server/jsonp.php','sdffs']);
   
   echo $_GET['callback'].'('.$jsondata.')';

   //eks.request.jsonp('http://localhost:2083/server/jsonp.php',{ff:'12'},function(data){ alert(JSON.stringify(data)); });

?>