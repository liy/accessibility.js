var scanning = new function(){
	var self = this;
	
	var _direction = 1;
	
	// tab, space
	this.forwardKeyCodes = [9, 32];
	this.backwardKeyCodes = [];
	this.selectKeyCodes = [13];
	
	var _scanIntervalID = 0;
	this.scanInterval = 2000;
	
	this.scanList = [];
	
	var _pointer = 0;
	
	var _isScanning = false;
	
	this.resetAfterSelect = true;
	
	this.autoScan = false;
	
	this.process = function(keyCode){
		if(autoScan){
			if(isKeyAllowed(keyCode))
				select();
			else{
				scan();
				_scanIntervalID = setInterval(scan, scanInterval)
			}
		}
		else{
			if(isSelectKeyCode(keyCode)){
				if(this.isScanning)
					select();
			}
			else if(isForwardKeyCode(keyCode)){
				_direction = 1;
				scan();
			}
			else if(isBackwardKeyCode(keyCode)){
				_direction = -1;
				scan();
			}
		}
	};
	
	function scan(){
		if(scanList[this.currentIndex] != null){
			// TODO dispatch roll out event
			console.log("roll out: " + this.currentIndex);
		}
		if(this.isScanning)
			this.pointer += _direction;
		if(scanList[this.currentIndex] != null){
			// TODO dispatch roll over event
			console.log("roll over: " + this.currentIndex);
		}
		
		if(resetAfterSelect)
			this.reset();
		else
			this.stop();
	};
	
	this.stop = function(){
		clearInterval(_scanIntervalID);
		_isScanning = false;
	};
	
	this.reset = function(){
		_pointer = 0;
		this.stop();
	};
	
	this.isKeyAllowed = function(keyCode){
		return isSelectKeyCode(keyCode) || isForwardKeyCode(keyCode) || isBackwardKeyCode(keyCode);
	};
	
	this.isSelectKeyCode = function(keyCode){
		for(var i in selectKeyCodes){
			if(keyCode == selectKeyCodes[i])
				return true;
		}
		return false
	};
	
	this.isForwardKeyCode = function(keyCode){
		for(var i in forwardKeyCodes){
			if(keyCode == forwardKeyCodes[i])
				return true;
		}
		return false		
	};
	
	this.isBackwardKeyCode = function(keyCode){
		for(var i in backwardKeyCodes){
			if(keyCode == backwardKeyCodes[i])
				return true;
		}
		return false		
	};
	
	Object.defineProperty(this, "currentIndex", {
		get: function(){
			if(scanList.length == 1)
				return 0;
				
			if(_pointer < 0)
				return scanList.length-1 + (_pointer+1) % scanList.length;
			else
				return _pointer % scanList.length;
		}
	});
	
	Object.defineProperty(this, "pointer", {
		set: function(value){
			// Clamp the pointer range from [-scanList.length, scanlist.length-1]
			// The reason this is necessary is:
			// If a item in the scan list is removed and the scan index does not reset to 0.
			// When user press switch again, the sensible item to be scanned will be the item after the 
			// removed one. e.g., if you have [A, B, C, D] 4 items, if you scan to item C, and removed it from
			// scan list, next item you start scan, it should scan D.
			// Clamp the pointer ensures this behaviour
			_pointer = value%scanList.length;
		},
		get: function(){
			return _pointer;
		}
	});
	
	Object.defineProperty(this, "isScanning", {
		get: function(){
			return _isScanning;
		}
	});
	
	Object.defineProperty(this, "direction", {
		set: function(dir){
			if(dir >= 0)
				_direction = 1;
			else
				_direction = -1;
		},
		get: function(){
			return _direction;
		}
	});
};