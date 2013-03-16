/**
 * glKit - A collection of WebGL tools
 *
 * Copyright (c) 2013 Henryk Wollik. All rights reserved.
 * http://henrykwollik.com
 *
 */

function GLKLight_Internal(id)
{
    this._id = id;

    this.uPosition     = null;
    this.uColorAmbient = null;
    this.uColorDiffuse = null;
    this.uColorSpecular= null;
    this.uShininess    = null;
    this.uEnabled      = null;
}