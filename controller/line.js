const _0x2a56=['block_b','collection','NODE','toString','Success','index','47dydEMT','10463qcRelx','createLine','sort','MultiLineString','mongo','FeatureCollection','105273VXqxQo','queryDataLine','deleteOne','SURFACE','237gWQsPM','94803qhjOUG','deleteLine','626403zRvWMB','length','437507syZtUo','373781iJvPLU','../database/config','Feature','insertedId','insertOne','deleteMany','Gi\x20Cung\x20Duoc\x20Group','connect','insertMany','features','push','toArray','geometry','FACE','map','_id','2433tbblQO','exports','mongodb','find'];const _0x1d74=function(_0x52f945,_0x5af915){_0x52f945=_0x52f945-0x1d6;let _0x2a56ef=_0x2a56[_0x52f945];return _0x2a56ef;};const _0x525b75=_0x1d74;(function(_0x13ed6a,_0x37b8b0){const _0x595955=_0x1d74;while(!![]){try{const _0x2851a1=-parseInt(_0x595955(0x1f9))+-parseInt(_0x595955(0x1fe))+parseInt(_0x595955(0x1f4))+-parseInt(_0x595955(0x1fb))+parseInt(_0x595955(0x1fd))+parseInt(_0x595955(0x1e3))*parseInt(_0x595955(0x1f8))+-parseInt(_0x595955(0x1ed))*-parseInt(_0x595955(0x1ee));if(_0x2851a1===_0x37b8b0)break;else _0x13ed6a['push'](_0x13ed6a['shift']());}catch(_0x14c1ec){_0x13ed6a['push'](_0x13ed6a['shift']());}}}(_0x2a56,0x7e04f));const {ObjectId}=require(_0x525b75(0x1e5)),db=require(_0x525b75(0x1ff));module['exports'][_0x525b75(0x1f5)]=function(_0xea39b3,_0x4382c9=null){return new Promise(async(_0x5ea704,_0x2570e0)=>{const _0x14d1b6=_0x1d74;try{const _0x4e4918={'type':_0x14d1b6(0x1f3),'copyright':_0x14d1b6(0x1d9),'timestamp':new Date(),'features':[]};await db[_0x14d1b6(0x1f2)][_0x14d1b6(0x1da)]();const _0x4c6ad3=await db[_0x14d1b6(0x1f2)]['db'](_0x14d1b6(0x1e7)),_0x161c0d=await _0x4c6ad3['collection']('SURFACE')[_0x14d1b6(0x1e6)]({'graphic:type':{'$eq':_0xea39b3}})['toArray']();for(let _0xc7b984=0x0;_0xc7b984<_0x161c0d[_0x14d1b6(0x1fc)];_0xc7b984++){_0x161c0d[_0xc7b984][_0x14d1b6(0x1e2)][_0x14d1b6(0x1ea)]();let _0x5a0bc9=await _0x4c6ad3[_0x14d1b6(0x1e8)](_0x14d1b6(0x1e0))[_0x14d1b6(0x1e6)]({'id_surface':_0x161c0d[_0xc7b984][_0x14d1b6(0x1e2)][_0x14d1b6(0x1ea)]()})[_0x14d1b6(0x1de)](),_0x3a0754={'type':_0x14d1b6(0x200),'properties':_0x161c0d[_0xc7b984],'geometry':{'type':_0x14d1b6(0x1f1),'coordinates':[]}};for(let _0x773829 of _0x5a0bc9){let _0x3986ed=await(await _0x4c6ad3[_0x14d1b6(0x1e8)](_0x14d1b6(0x1e9))['find']({'id_face':_0x773829[_0x14d1b6(0x1e2)][_0x14d1b6(0x1ea)]()})[_0x14d1b6(0x1f0)]([_0x14d1b6(0x1ec)],0x1)['toArray']())[_0x14d1b6(0x1e1)](_0x1ec336=>{return[_0x1ec336['x'],_0x1ec336['y'],_0x1ec336['z']];});_0x3a0754[_0x14d1b6(0x1df)]['coordinates'][_0x14d1b6(0x1dd)](_0x3986ed);}_0x4e4918[_0x14d1b6(0x1dc)][_0x14d1b6(0x1dd)](_0x3a0754);}_0x5ea704(_0x4e4918);}catch(_0x4352da){_0x5ea704({'error':_0x4352da});throw _0x4352da;}});},module['exports'][_0x525b75(0x1ef)]=function(_0x24395f,_0x3a6849){return new Promise(async(_0x3a9540,_0x542455)=>{const _0x185065=_0x1d74;try{await db['mongo']['connect']();const _0x3ec6a9=await db[_0x185065(0x1f2)]['db']('block_b'),_0x16248e=await _0x3ec6a9[_0x185065(0x1e8)](_0x185065(0x1f7))[_0x185065(0x1d7)](_0x24395f);for(let _0x460869=0x0;_0x460869<_0x3a6849[_0x185065(0x1fc)];_0x460869++){let _0x4e022f=await _0x3ec6a9[_0x185065(0x1e8)](_0x185065(0x1e0))[_0x185065(0x1d7)]({'id_surface':_0x16248e[_0x185065(0x1d6)][_0x185065(0x1ea)]()}),_0x50dc98=_0x3a6849[_0x460869][_0x185065(0x1e1)]((_0x367977,_0x372b52)=>{const _0x110445=_0x185065;return{'x':_0x367977[0x0],'y':_0x367977[0x1],'z':_0x367977[0x2],'index':_0x372b52,'id_face':_0x4e022f[_0x110445(0x1d6)][_0x110445(0x1ea)]()};});await _0x3ec6a9[_0x185065(0x1e8)](_0x185065(0x1e9))[_0x185065(0x1db)](_0x50dc98);}_0x3a9540({'id_surface':_0x16248e[_0x185065(0x1d6)]});}catch(_0x389e2f){_0x3a9540(_0x389e2f);}});},module[_0x525b75(0x1e4)][_0x525b75(0x1fa)]=function(_0x5229ed){return new Promise(async(_0x39b5dc,_0x3067f6)=>{const _0x25848b=_0x1d74;try{await db['mongo']['connect']();const _0x27334a=await db['mongo']['db'](_0x25848b(0x1e7));await _0x27334a[_0x25848b(0x1e8)]('SURFACE')[_0x25848b(0x1f6)]({'_id':_0x5229ed});const _0x30dca7=await _0x27334a[_0x25848b(0x1e8)](_0x25848b(0x1e0))[_0x25848b(0x1e6)]({'id_surface':_0x5229ed[_0x25848b(0x1ea)]()})[_0x25848b(0x1de)]();for(let _0x4c7e0b of _0x30dca7){await _0x27334a[_0x25848b(0x1e8)](_0x25848b(0x1e9))[_0x25848b(0x1d8)]({'id_face':_0x4c7e0b[_0x25848b(0x1e2)][_0x25848b(0x1ea)]()}),await _0x27334a['collection'](_0x25848b(0x1e0))[_0x25848b(0x1f6)]({'_id':_0x4c7e0b[_0x25848b(0x1e2)]});}_0x39b5dc(_0x25848b(0x1eb));}catch(_0x1a687d){_0x3067f6(_0x1a687d);}});};