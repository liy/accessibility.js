(function(window){
	var scanning = new function(){
		var self = this;

		var _direction = 1;

		// tab, space
		this.forwardKeyCodes = [9, 32];
		this.backwardKeyCodes = [];
		this.selectKeyCodes = [13];

		var _scanIntervalID = 0;
		this.scanInterval = 2000;

		this.scanList = null;

		var _pointer = 0;

		var _isScanning = false;

		this.resetAfterSelect = true;

		this.autoScan = true;

		this.process = function(keyCode){
			if(this.autoScan){
				if(!this.isKeyAllowed(keyCode))
					return;
				
				// If the scan has already started, do the selection
				if(this.isScanning){
					select();
				}
				else{
					scan();
					_scanIntervalID = setInterval(scan, this.scanInterval)
				}
			}
			else{
				if(this.isSelectKeyCode(keyCode)){
					if(this.isScanning)
						select();
				}
				else if(this.isForwardKeyCode(keyCode)){
					_direction = 1;
					scan();
				}
				else if(this.isBackwardKeyCode(keyCode)){
					_direction = -1;
					scan();
				}
			}
		};

		function scan(){			
			if(self.scanList[self.currentIndex] != null){
				// dispatch roll out event
				if(self.scanList[self.currentIndex].onScanOut)
					self.scanList[self.currentIndex].onScanOut();
			}
			if(self.isScanning)
				self.pointer += _direction;
			if(self.scanList[self.currentIndex] != null){
				// dispatch roll over event
				if(self.scanList[self.currentIndex].onScanOver)
					self.scanList[self.currentIndex].onScanOver();
			}
						
			_isScanning = true;
		};
		
		function select(){
			// roll out the selected item
			if(self.scanList[self.currentIndex].onScanOut)
				self.scanList[self.currentIndex].onScanOut();
			// trigger select, only it has onClick handler
			if(self.scanList[self.currentIndex].onScanSelect)
				self.scanList[self.currentIndex].onScanSelect();
			
			if(self.resetAfterSelect)
				self.reset();
			else
				self.stop();
		}

		this.stop = function(){
			clearInterval(_scanIntervalID);
			_isScanning = false;
		};

		this.reset = function(){
			_pointer = 0;
			this.stop();
		};

		this.isKeyAllowed = function(keyCode){
			return this.isSelectKeyCode(keyCode) || this.isForwardKeyCode(keyCode) || this.isBackwardKeyCode(keyCode);
		};

		this.isSelectKeyCode = function(keyCode){
			for(var i in this.selectKeyCodes){
				if(keyCode == this.selectKeyCodes[i])
					return true;
			}
			return false
		};

		this.isForwardKeyCode = function(keyCode){
			for(var i in this.forwardKeyCodes){
				if(keyCode == this.forwardKeyCodes[i])
					return true;
			}
			return false		
		};

		this.isBackwardKeyCode = function(keyCode){
			for(var i in this.backwardKeyCodes){
				if(keyCode == this.backwardKeyCodes[i])
					return true;
			}
			return false		
		};

		Object.defineProperty(this, "currentIndex", {
			get: function(){
				if(this.scanList.length == 1)
					return 0;

				if(_pointer < 0)
					return this.scanList.length-1 + (_pointer+1) % this.scanList.length;
				else
					return _pointer % this.scanList.length;
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
				_pointer = value%this.scanList.length;
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
	
	// scan list, only avaiable for Scan class
	function ScanList(){

	};
	var sp = ScanList.prototype = new Array;
	
	sp.remove = function(item){
		var index = this.indexOf(item);
		delete this[index];
	};
	
	sp.removeAt = function(index){
		delete this[index];
	};
	
	sp.add = function(item){
		this.push(item);
	};
	
	sp.clear = function(){
		for(var i=this.length; i>0; --i){
			delete this[index-1];
		}
	};
	
	// setup scan list
	scanning.scanList = new ScanList();
	window.scanning = scanning;
	
}(window))