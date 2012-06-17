var switches = new function(){
	var self = this;
	
	// tab, enter, space
	this.keyCodesAllowed = [9, 13, 32];
	
	this.preAcceptance = 1000;
	var _preAcptTimeoutIDMap = Object.create(null);
	
	this.debounce = 1000;
	var _debounceTimeoutIDMap = Object.create(null);
	
	var _keyDownMap = Object.create(null);
	
	document.onkeydown = function(e){
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
		console.log("process press: " + isKeyDown(keyCode));
		
		// TODO: dispatch press event.
	};
	
	document.onkeyup = function(e){
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
		console.log("process release: " + isKeyDown(keyCode));
		delete _preAcptTimeoutIDMap[keyCode];
		
		// TODO: dispatch release event	
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
};