// se invocan las variables necesitadas
var express    = require('express');        // se llama express
var app        = express();                 // app usando express
var bodyParser = require('body-parser');

// Soporte de HAL 
var halson = require('halson');

// configura app para usar bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Se establece puerto
var port = process.env.PORT || 8888;        

// Carga configuraciones de config.js
var config = require('./config');

// Conexión a MongoDB
var mongoose = require('mongoose');

// conexion de MongoDB a models
mongoose.connect(config.db[app.settings.env]); 

// importar models
var ProductQuantity = require('./app/models/product_quantity');

// obtiene una instancia a Router express
var router = express.Router(); 

// crear/actualizar una cantidad de producto - productQuantity
router.put('/product_quantities/:product_id', function(req, res) {

    if (req.body.quantity_onhand == null) {
	res.status(400);
	res.setHeader('Content-Type', 'application/vnd.error+json');
	res.json({ message: "Parámetro quantity_onhand (número de productos) es requerido"});
    }  else
    {

        ProductQuantity.findOne({ product_id: req.params.product_id}, function(err, productQuantity) {
	    if (err) return console.error(err);

	    var created = false; // valida creado vs. actualizado
	    if (productQuantity == null) {
		productQuantity = new ProductQuantity();
		productQuantity.product_id = req.params.product_id;
		created = true;
	    }

	    // establecer/actualizr onhand quantity y guardar
	    productQuantity.quantity_onhand = req.body.quantity_onhand;
	    productQuantity.save(function(err) {
		if (err) {
		    res.status(500);
		    res.setHeader('Content-Type', 'application/vnd.error+json');
		    res.json({ message: "Falla al guardar productQuantity (Producto)"});
		} else {
		    // returna el codigo de respuesta
		    if (created) {
			res.status(201);
		    } else {
			res.status(200);
		    }
		    
		    res.setHeader('Content-Type', 'application/hal+json');
		    
		    var resource = halson({
			product_id: productQuantity.product_id,
			quantity_onhand: productQuantity.quantity_onhand,
			created_at: productQuantity.created_at
		    }).addLink('self', '/product_quantities/'+productQuantity.product_id)
		    
		    res.send(JSON.stringify(resource));
		}
	    });
	});
    }	
});
	
router.get('/product_quantities/:product_id', function(req, res) {
    ProductQuantity.findOne({product_id: req.params.product_id}, function(err, productQuantity) {
        if (err) {
	    res.status(500);
	    res.setHeader('Content-Type', 'application/vnd.error+json');
	    res.json({ message: "Falla al buscar ProductQuantities"});
	} else if (productQuantity == null) {
	    res.status(404);
	    res.setHeader('Content-Type', 'application/vnd.error+json');
	    res.json({ message: "Producto (ProductQuantity) no encontrado para product_id "+req.params.product_id});
	} else {
	    res.status(200);
	    res.setHeader('Content-Type', 'application/hal+json');

	    var resource = halson({
		product_id: productQuantity.product_id,
		quantity_onhand: productQuantity.quantity_onhand,
		created_at: productQuantity.created_at
	    }).addLink('self', '/product_quantities/'+productQuantity.product_id)
	    res.send(JSON.stringify(resource));
	    
	}
    });	
});


// Registrar ruta
app.use('/', router);

// Inicia el server
app.listen(port);
console.log('Running on port ' + port);
