<DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Formulaire</title>
</head>
<header>
    Gestion de BDD
</header>

<body>
    <form method="POST">
        <select name="method" size="1">
            <option value="CREATE_TAB">Créer une table</option>
            <option value="GET_TABLE">Récupérer toutes les infos d'une table</option>
            <option value="GET_ID">Récupérer une donnée grâce à son id</option>
            <option value="GET_ELT">Récupérer des données avec une valeur précise</option>
            <option value="ADD_ELT">Ajouter une donnée dans une table</option>
            <option value="PATCH_ELT">Modifier une donnée</option>
            <option value="DELETE_ELT">Supprimer une donnée</option>
        </select>
        <input type="text" name="JSON" placeholder='JSON'/>
        <input type="submit" value="Submit"/>
    </form>

    <?php
        $ini_array = parse_ini_file("config.ini");

        $json = $_POST['JSON'];
        $token = $ini_array["PROJECT_TOKEN"];
        $projectName = $ini_array["PROJECT_NAME"];

        if($_POST['method']=="CREATE_TAB"){
            $method = "POST";
            $addr = "http://localhost:8000/api";
            $postdata= http_build_query(
                array(
                    'ProjectToken' => $token,
                    'ProjectName' => $projectName,
                    'data' =>$json
                )
            );
        }elseif($_POST['method']=="GET_TABLE"){
            $method = "GET";
            $dbname = $json['dbname'];
            $addr = "http://localhost:8000/$dbname";
            $postdata = http_build_query(array());
        }elseif($_POST['method']=="GET_ID"){
            $method = "GET";
            $dbname = $json['dbname'];
            $id = $json['id'];
            $addr = "http://localhost:8000/$dbname/$id";
            $postdata = http_build_query(array());
        }elseif($_POST['method']=="GET_ELT"){
            $method = "GET";
            $dbname = $json['dbname'];
            $column = $json['column'];
            $elt = $json['elt'];
            $addr = "http://localhost:8000/$dbname/$column/$elt";
            $postdata = http_build_query(array());
        }elseif($_POST['method']=="ADD_ELT"){
            $method = "POST";
            $addr = "http://localhost:8000/api/add";
            $postdata= http_build_query(
                array(
                    'ProjectToken' => $token,
                    'ProjectName' => $projectName,
                    'data' =>$json
                )
            );
        }elseif($_POST['method']=="PATCH_ELT"){
            $method = "PATCH";
            $addr = "http://localhost:8000/api/patch";
            $postdata= http_build_query(
                array(
                    'ProjectToken' => $token,
                    'ProjectName' => $projectName,
                    'data' =>$json
                )
            );
        }elseif($_POST['method']=="DELETE_ELT"){
            $method = "DELETE";
            $dbname = $json['dbname'];
            $id = $json['id'];
            $addr = "http://localhost:8000/api/$dbname/$id";
            $postdata= http_build_query( array());
        }
        
        $opts = array('http' =>
            array(
                'method' => $method,
                'header' => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );

        $context = stream_context_create($opts);
        $result = file_get_contents($addr,false,$context);

    ?>
</body>
</html>
