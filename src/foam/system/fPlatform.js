var Platform = {WEB:0,PLASK:1,NODE_WEBKIT:2};
    Platform._target = null;

Platform.getTarget  = function()
{
    //TODO fix&finish
    if(!this._target)
    {
        var bWindow   = typeof window !== 'undefined',
            bDocument = typeof document !== 'undefined',
            bRequireF = typeof require == 'function',
            bRequire  = !!require,
            bProcess  = typeof process !== 'undefined';

        console.log(bWindow,bDocument,bRequireF,bRequire,bProcess);

        this._target = (bWindow && bDocument) ? this.WEB :
                       (bWindow && bDocument && bRequireF && bRequire) ? this.NODE_WEBKIT :
                       (bRequireF && bRequire) ? this.PLASK :
                       null;
    }

    return this._target;
};

module.exports = Platform;