function Event(sender,type,data){
    this.sender = sender;
    this.type   = type;
    this.data   = data;
}

Event.prototype.copy = function(){
    return new Event(this.sender,this.type,this.data);
};

module.exports = Event;
