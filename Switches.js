var switches = new function(){
	var self = this;
	
	// tab, enter, space
	this.keyCodesAllowed = [9, 13, 32];
	
	this.preAcceptance = 0;
	var _preAcptTimeoutIDMap = Object.create(null);
	
	this.debounce = 0;
	var _debounceTimeoutIDMap = Object.create(null);
	
	var _keyDownMap = Object.create(null);
	
	var _listeners = [];
	
	this.enabled = true;
	
	document.onkeydown = function(e){
		if(!self.enabled)
			return;
		
		if(self.isKeyAllowed(e.keyCode)){
			clearTimeout(_debounceTimeoutIDMap[e.keyCode]);
			
			// make sure the key is not down
			if(!isKeyDown(e.keyCode)){
				if(self.preAcceptance == 0)
					processPress(e.keyCode);
				else
					_preAcptTimeoutIDMap[e.keyCode] = setTimeout(processPress, self.preAcceptance, e.keyCode);
			}
			
			_keyDownMap[e.keyCode] = true;
		}
	};
	
	function processPress(keyCode){
		// console.log("process press: " + isKeyDown(keyCode));
		
		// TODO: dispatch press event.
		var event = Object.create(null);
		event.type = "switch press";
		event.keyCode = keyCode;
		self.dispatchEvent(event);
		
		// var e = document.createEvent('Event');
		// 		e.initEvent('switch press', true, true);
		// 		e.keyCode = keyCode;
		// 		this.dispatchEvent(e);
	};
	
	document.onkeyup = function(e){
		if(!self.enabled)
			return;
			
		if(self.isKeyAllowed(e.keyCode)){
			clearTimeout(_preAcptTimeoutIDMap[e.keyCode])
			
			if(self.debounce == 0)
				processRelease(e.keyCode);
			else
				_debounceTimeoutIDMap[e.keyCode] = setTimeout(processRelease, self.debounce, e.keyCode);
				
			delete _keyDownMap[event.keyCode];
		}
	};
	
	function processRelease(keyCode){
		// console.log("process release: " + isKeyDown(keyCode));
		delete _preAcptTimeoutIDMap[keyCode];
		
		// TODO: dispatch release event
		var event = Object.create(null);
		event.type = "switch release";
		event.keyCode = keyCode;
		self.dispatchEvent(event);
		
		// var e = document.createEvent('Event');
		// e.initEvent('switch release', true, true);
		// e.keyCode = keyCode;
		// this.dispatchEvent(e);
	};
	
	this.isKeyAllowed = function(keyCode){
		for(var i in this.keyCodesAllowed){
			if(this.keyCodesAllowed[i] == keyCode)
				return true
		}
		return false;
	}
	
	function isKeyDown(keyCode){
		return Boolean(keyCode in _keyDownMap);
	}
	
	this.addListener = function(eventName, func){
		var listener = Object.create(null);
		listener.type = eventName;
		listener.func = func;
		_listeners.push(listener);
	}
	
	this.removeListener = function(eventName, func){
		for(var i in _listeners){
			if(_listeners[i].type == eventName && func == _listeners[i].func){
				delete _listeners[i];
				return;
			}
		}
	}
	
	this.dispatchEvent = function(event){
		for(var i in _listeners){
			if(_listeners[i].type == event.type){
				_listeners[i].func(event);
			}
		}
	}
};