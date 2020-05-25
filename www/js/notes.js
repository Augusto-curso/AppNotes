var app = {
	
	 model: {
		 "notas": [{"titulo": "Comprar pan", "contenido": "oferta en el dia"}]
     },
	 
	 firebaseConfig: {
		 apiKey: "AIzaSyAQ1UbpH5Ndsbce6nPcrpgiF4gPAInueKg",
         authDomain: "app5-54108.firebaseapp.com",
         databaseURL: "https://app5-54108.firebaseio.com",
         projectId: "app5-54108",
         storageBucket: "app5-54108.appspot.com",
         messagingSenderId: "251818358525",
         appId: "1:251818358525:web:6ec7f5c3c94570879d3094",
         measurementId: "G-C03MZTRCNR"
	 },	 
		  
	 inicio: function(){
		 this.iniciaFastClick();
		 this.iniciaFirebase();
		 this.iniciaBotones();
		 this.refrescarLista();
     },
	 
	 iniciaFastClick: function() {
		 FastClick.attach(document.body);
	 },
	 
	 iniciaFirebase: function() {
		 firebase.initializeApp(this.firebaseConfig);
	 },	 

     iniciaBotones: function() {
		 var guardar = document.querySelector('#guardar');
		 var añadir = document.querySelector('#añadir');
		 
		 añadir.addEventListener('click', this.mostrarEditor, false);
		 guardar.addEventListener('click', this.guardarNota, false);
     },

     mostrarEditor: function() {	 
	     document.getElementById('titulo').value = "";
		 document.getElementById('comentario').value = "";
		 document.getElementById("note-editor").style.display = "block";
		 document.getElementById('titulo').focus();
     },

	 guardarNota: function() {	 
	     app.construirNota();
		 app.ocultarEditor();
		 app.refrescarLista();
		 app.grabarDatos();
     },
	 
     construirNota: function() {
		 var notas = app.model.notas;
         notas.push({"titulo": app.extraerTitulo(), "contenido": app.extraerComentario() }); 
	 },	
	 
	 extraerTitulo: function() {
         return document.getElementById('titulo').value;
     },
	 
	 extraerComentario: function() {
		 return document.getElementById('comentario').value;
	 },	 
	 
	 ocultarEditor: function() {
	     document.getElementById("note-editor").style.display = "none";
	 },
	 
	 refrescarLista: function() {	 
	     var div = document.getElementById('notes-list');
		 div.innerHTML = this.añadirNotasLista();
     },
	 
	 añadirNotasLista: function() {	 
	     var notas = this.model.notas;
		 var notasDivs = '';
		 for (var i in notas) {
			 var titulo = notas[i].titulo;
			 notasDivs= notasDivs + this.añadirNota(i, titulo);
	     }
	     return notasDivs;
     },
	 
	 añadirNota: function(id, titulo) {
		 return "<div class='note-item' id= 'notas[" + id + "]'>" + titulo + "</div>";		 
	 },	 
	 
	 grabarDatos: function() {
		 window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.goFS, this.fail);
	 }, 
	 
	 goFS: function (fileSystem) {
		 fileSystem.getFile("files/"+"model.json", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
	 }, 
	 
	  gotFileEntry: function (fileEntry) {
		 fileEntry.createWriter(app.gotFileWriter, app.fail);
	 },
	 
	  gotFileWriter: function (writer) {
		 writer.onwriteend = function(evt) {
			 console.log("datos grabados en externalApplicationStorageDirectory");
			 if(app.hayWifi()) {
				 app.guardarFirebase();
		     }
	     };
		 writer.write(JSON.stringify(app.model));
	 },
	 
	 guardarFirebase: function() {
		 var ref = firebase.storage().ref('model.json');
		 ref.putString(JSON.stringify(app.model));
	 },
	 
	 hayWifi: function() {
		 return navigator.connection.type==='wifi';
	 },
	                                                                                                                                               
	 
	 leerDatos: function () {
		 window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, app.obtenerFS, app.fail);
	 },
	 
     obtenerFS: function (fileSystem) {
		 fileSystem.getFile("files/"+"model.json", null, app.obtenerFileEntry, app.fail);
	 },
	 
	 obtenerFileEntry: function(fileEntry) {
		 fileEntry.file(app.leerFile, app.fail);
	 },
	 
	 leerFile: function(file){
		 var reader = new FileReader();
		 reader.onloadend = function(evt) {
			 var data = evt.target.result;
			 app.model = JSON.parse(data);
			 app.inicio();
		 };
         reader.readAsText(file);
	 },	 
	 
	 fail: function(error) {
		 if (error.code === 1) {
		     app.grabarDatos();
             setTimeout(app.leerDatos, 2500); 
		 }
	 },		 
};

if ('addEventListener' in document)	{
	document.addEventListener('deviceready', function() {
		 app.leerDatos();
	 }, false);
};
	 
	 
		 
		 
		 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 

	 