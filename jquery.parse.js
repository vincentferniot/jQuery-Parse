(function($){
	
	var ns, _opts, methods;
	
	//Plugin namespace you can change this if you want.. 
	//i.e, ns = "db" = $.db.get/post/put/delete
	ns = "parse";
	
	//default opts
	_opts = {
		base : "https://api.parse.com/1/classes/", 
		auth : false
	};
	
	//public methods
	methods = {};
	
	function _creds(){
		var error;
		
		if(_opts.auth){
			return true;
		}
		
		error = "Missing auth key. You should pass your basic Auth key to $."+ns+".init";
		alert(error);
		$.error(error);
		
		return false;
	}
	
	function _error(jqXHR, textStatus, errorThrown){
		$.error("$." + ns +" :" + textStatus +" "+errorThrown);
	}
	
	//TODO JSON.stringify dependency?
	function _http(method, uri, data){
		var req, _data;
		
		if(!_creds()){
			return false;
		}
		
		req = {
			//data
			contentType : "application/json", 
			processData : false, 
			dataType : 'json', 
			
			//action
			url : _opts.base + uri,
			type : method,  
			
			//Credentials 
			// -Note last I checked Stripe doesn't recognize Basic Auth sent through the URL scheme
			username : _opts.app_id, 
			password : _opts.master_key, 
			
			//Have to manually set a basic auth header. See above. 
			//Use Parse.sh result to C&P your basic auth and pass in $.parse.init
			headers : {
				Authorization: "Basic " + _opts.auth
			}, 
			error : _error	
		};
		
		//handle data.
		data = typeof data === 'object' ? JSON.stringify(data) : false;
		data = method === 'GET' && data ? "where=" + encodeURIComponent(data) : data;
		req.data = data;
		return $.ajax(req);
	}
	

	function _done(req, cb){
		typeof cb === "function" && req.done(cb);
		return $[ns];
	}
	//exports
		
	methods.init = function(customOpts){
		$.extend(_opts, typeof customOpts === 'object' ? customOpts : {}, true);
		return $[ns];
	}
	

	$.each(['GET', 'POST', 'PUT', 'DELETE'],function(i, action){
		var m = action.toLowerCase();
		
		methods[m] = function(){
			var args, uri, data, cb, req;
			
			args = arguments;
			uri = args[0];
			data = args[1];
			cb = args[2];
			
			if(typeof args[1] === 'function'){
				data = false;
				cb = args[1];
			}
						
			req = _http(action, uri, data);
			return _done(req, cb);
		};
		
	});
	
	
	$[ns] = methods;
	
})(jQuery);