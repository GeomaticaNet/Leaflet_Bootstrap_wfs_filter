<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>GeomaticaNet | Buscador de elementos con Leaflet, Bootstrap 4.6, Geoserver y Postgis</title>


    <!-- ================= LEAFLET CSS =============================== -->

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />

    <!-- ================= Bootstrap CSS ================================ -->

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">

    <!-- ================= FontAwesome ================================ -->

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <!-- ================= CSS Personalizado ============ ============== -->
    <link rel="stylesheet" href="./css/style.css">

</head>

<body>
    <section id="nav-bar">

        <!-- Just an image 
        <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="#">
                <img src="/docs/4.6/assets/brand/bootstrap-solid.svg" width="30" height="30" alt="">
            </a>
        </nav>-->

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="./">
                <img src="./img/logo_white_large.png" height="30" width="246">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>


            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="./">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./about.html">Acerca de</a>
                    </li>
                </ul>
            </div>
        </nav>
    </section>


    <section class="container-fluid">
        <div class="row">
            <div class="col-lg-3 left-sidebar">
                <div class="mt-4 mb-3">
                    <h4>Buscar ubicación</h4>
                </div>
                <div class="form-inline">
                    <input class="form-control col-sm-12 mr-2 mb-2" type="text" placeholder="Encontrar..." id="search-value" />
                    <div class="form-group sm-3">
                        <button class="btn btn-secondary mr-2 mb-2" onclick="searchWFS()">Buscar</button>
                        <button class="btn btn-secondary mb-2" onclick="clearResult()">Borrar</button>
                    </div>
                </div>
                <div id="wfsResult" class=""></div>

                <div id="alert_empty" class="alert alert-warning alert-dismissible fade hide" role="alert">
                    <strong>Por favor introduzca una entrada!</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>


                <div id="alert_noResult" class="alert alert-danger alert-dismissible fade hide" role="alert">
                    <strong>No se encuentra(n) resultado(s)!<br></strong> Por favor intente de nuevo.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div id="searchResults" class=""></div>

            </div>
            <div class="col-lg-9" id="map">
                <div class="leaflet-control basic-functions">
                    <div class="default-view btns" data-toggle="tooltip" title="Zoom full text">
                        <i class="fas fa-home"></i>
                    </div>
                </div>
                <div class="leaflet-control map-coordinate"></div>
            </div>
        </div>
    </section>

    <!-- JQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>



    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns" crossorigin="anonymous"></script>

    <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>

    <!-- Custom JS -->
    <script type="text/javascript" src="./js/myleaflet-min.js"></script>

</body>

</html>