/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/  	var parentJsonpFunction = window["webpackJsonp"];
/******/  	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/  		// add "moreModules" to the modules object,
/******/  		// then flag all "chunkIds" as loaded and fire callback
/******/  		var moduleId, chunkId, i = 0, resolves = [], result;
/******/  		for(;i < chunkIds.length; i++) {
/******/  			chunkId = chunkIds[i];
/******/  			resolves.push(installedChunks[chunkId][0]);
/******/  		}
/******/  		installedChunks[chunkId] = 0;
/******/  		for(moduleId in moreModules) {
/******/  			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/  				modules[moduleId] = moreModules[moduleId];
/******/  			}
/******/  		}
/******/  		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/  		while(resolves.length) {
/******/  			resolves.shift()();
/******/  		}
/******/  	};   
/******/  	function hotDisposeChunk(chunkId) {
/******/  	    delete installedChunks[chunkId];
/******/  	}
/******/  	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/  	window["webpackHotUpdate"] = 
/******/  	    function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/  	        hotAddUpdateChunk(chunkId, moreModules);
/******/  	        if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/  	    } ;
/******/
/******/  	    function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/  	        var head = document.getElementsByTagName("head")[0];
/******/  	        var script = document.createElement("script");
/******/  	        script.type = "text/javascript";
/******/  	        script.charset = "utf-8";
/******/  	        script.src = __webpack_require__.p + "" + chunkId+ "." + hotCurrentHash + ".hot-update.js";
/******/  	        head.appendChild(script);
/******/  	    }
/******/
/******/  	    function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/  	        requestTimeout = requestTimeout || 10000;
/******/  	        return new Promise(function(resolve, reject) {
/******/  	            if(typeof XMLHttpRequest === "undefined")
/******/  	                return reject(new Error("No browser support"));
/******/  	            try {
/******/  	                var request = new XMLHttpRequest();
/******/  	                var requestPath = __webpack_require__.p + ""+hotCurrentHash+".hot-update.json";
/******/  	                request.open("GET", requestPath, true);
/******/  	                request.timeout = requestTimeout;
/******/  	                request.send(null);
/******/  	            } catch(err) {
/******/  	                return reject(err);
/******/  	            }
/******/  	            request.onreadystatechange = function() {
/******/  	                if(request.readyState !== 4) return;
/******/  	                if(request.status === 0) {
/******/  	                    // timeout
/******/  	                    reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/  	                } else if(request.status === 404) {
/******/  	                    // no update available
/******/  	                    resolve();
/******/  	                } else if(request.status !== 200 && request.status !== 304) {
/******/  	                    // other failure
/******/  	                    reject(new Error("Manifest request to " + requestPath + " failed."));
/******/  	                } else {
/******/  	                    // success
/******/  	                    try {
/******/  	                        var update = JSON.parse(request.responseText);
/******/  	                    } catch(e) {
/******/  	                        reject(e);
/******/  	                        return;
/******/  	                    }
/******/  	                    resolve(update);
/******/  	                }
/******/  	            };
/******/  	        });
/******/  	    }
/******/
/******/
/******/  	    var hotApplyOnUpdate = true;
/******/  	    var hotCurrentHash = "57fc2e4cc0c86c64d2a72e1fdf4de9bb"; // eslint-disable-line no-unused-vars
/******/  	    var hotRequestTimeout = 10000;
/******/  	    var hotCurrentModuleData = {};
/******/  	    var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/  	    var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/  	    var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/  	    function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/  	        var me = installedModules[moduleId];
/******/  	        if (!me) return __webpack_require__;
/******/  	        var fn = function (request) {
/******/  	            if (me.hot.active) {
/******/  	                if (installedModules[request]) {
/******/  	                    if (installedModules[request].parents.indexOf(moduleId) < 0)
/******/  	                        installedModules[request].parents.push(moduleId);
/******/  	                } else {
/******/  	                    hotCurrentParents = [moduleId];
/******/  	                    hotCurrentChildModule = request;
/******/  	                }
/******/  	                if (me.children.indexOf(request) < 0)
/******/  	                    me.children.push(request);
/******/  	            } else {
/******/  	                console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/  	                hotCurrentParents = [];
/******/  	            }
/******/  	            return __webpack_require__(request);
/******/  	        };
/******/  	        var ObjectFactory = function ObjectFactory(name) {
/******/  	            return {
/******/  	                configurable: true,
/******/  	                enumerable: true,
/******/  	                get: function () {
/******/  	                    return __webpack_require__[name];
/******/  	                },
/******/  	                set: function (value) {
/******/  	                    __webpack_require__[name] = value;
/******/  	                }
/******/  	            };
/******/  	        };
/******/  	        for (var name in __webpack_require__) {
/******/  	            if (Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/  	                Object.defineProperty(fn, name, ObjectFactory(name));
/******/  	            }
/******/  	        }
/******/  	        fn.e = function (chunkId) {
/******/  	            if (hotStatus === "ready")
/******/  	                hotSetStatus("prepare");
/******/  	            hotChunksLoading++;
/******/  	            return __webpack_require__.e(chunkId).then(finishChunkLoading, function (err) {
/******/  	                finishChunkLoading();
/******/  	                throw err;
/******/  	            });
/******/
/******/  	            function finishChunkLoading() {
/******/  	                hotChunksLoading--;
/******/  	                if (hotStatus === "prepare") {
/******/  	                    if (!hotWaitingFilesMap[chunkId]) {
/******/  	                        hotEnsureUpdateChunk(chunkId);
/******/  	                    }
/******/  	                    if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/  	                        hotUpdateDownloaded();
/******/  	                    }
/******/  	                }
/******/  	            }
/******/  	        };
/******/  	        return fn;
/******/  	    }
/******/
/******/  	    function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/  	        var hot = {
/******/  	            // private stuff
/******/  	            _acceptedDependencies: {},
/******/  	            _declinedDependencies: {},
/******/  	            _selfAccepted: false,
/******/  	            _selfDeclined: false,
/******/  	            _disposeHandlers: [],
/******/  	            _main: hotCurrentChildModule !== moduleId,
/******/
/******/  	            // Module API
/******/  	            active: true,
/******/  	            accept: function (dep, callback) {
/******/  	                if (typeof dep === "undefined")
/******/  	                    hot._selfAccepted = true;
/******/  	                else if (typeof dep === "function")
/******/  	                    hot._selfAccepted = dep;
/******/  	                else if (typeof dep === "object")
/******/  	                    for (var i = 0; i < dep.length; i++)
/******/  	                        hot._acceptedDependencies[dep[i]] = callback || function () {
/******/  	                        };
/******/  	                else
/******/  	                    hot._acceptedDependencies[dep] = callback || function () {
/******/  	                    };
/******/  	            },
/******/  	            decline: function (dep) {
/******/  	                if (typeof dep === "undefined")
/******/  	                    hot._selfDeclined = true;
/******/  	                else if (typeof dep === "object")
/******/  	                    for (var i = 0; i < dep.length; i++)
/******/  	                        hot._declinedDependencies[dep[i]] = true;
/******/  	                else
/******/  	                    hot._declinedDependencies[dep] = true;
/******/  	            },
/******/  	            dispose: function (callback) {
/******/  	                hot._disposeHandlers.push(callback);
/******/  	            },
/******/  	            addDisposeHandler: function (callback) {
/******/  	                hot._disposeHandlers.push(callback);
/******/  	            },
/******/  	            removeDisposeHandler: function (callback) {
/******/  	                var idx = hot._disposeHandlers.indexOf(callback);
/******/  	                if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/  	            },
/******/
/******/  	            // Management API
/******/  	            check: hotCheck,
/******/  	            apply: hotApply,
/******/  	            status: function (l) {
/******/  	                if (!l) return hotStatus;
/******/  	                hotStatusHandlers.push(l);
/******/  	            },
/******/  	            addStatusHandler: function (l) {
/******/  	                hotStatusHandlers.push(l);
/******/  	            },
/******/  	            removeStatusHandler: function (l) {
/******/  	                var idx = hotStatusHandlers.indexOf(l);
/******/  	                if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/  	            },
/******/
/******/  	            //inherit from previous dispose call
/******/  	            data: hotCurrentModuleData[moduleId]
/******/  	        };
/******/  	        hotCurrentChildModule = undefined;
/******/  	        return hot;
/******/  	    }
/******/
/******/  	    var hotStatusHandlers = [];
/******/  	    var hotStatus = "idle";
/******/
/******/  	    function hotSetStatus(newStatus) {
/******/  	        hotStatus = newStatus;
/******/  	        for (var i = 0; i < hotStatusHandlers.length; i++)
/******/  	            hotStatusHandlers[i].call(null, newStatus);
/******/  	    }
/******/
/******/  	    // while downloading
/******/  	    var hotWaitingFiles = 0;
/******/  	    var hotChunksLoading = 0;
/******/  	    var hotWaitingFilesMap = {};
/******/  	    var hotRequestedFilesMap = {};
/******/  	    var hotAvailableFilesMap = {};
/******/  	    var hotDeferred;
/******/
/******/  	    // The update info
/******/  	    var hotUpdate, hotUpdateNewHash;
/******/
/******/  	    function toModuleId(id) {
/******/  	        var isNumber = (+id) + "" === id;
/******/  	        return isNumber ? +id : id;
/******/  	    }
/******/
/******/  	    function hotCheck(apply) {
/******/  	        if (hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/  	        hotApplyOnUpdate = apply;
/******/  	        hotSetStatus("check");
/******/  	        return hotDownloadManifest(hotRequestTimeout).then(function (update) {
/******/  	            if (!update) {
/******/  	                hotSetStatus("idle");
/******/  	                return null;
/******/  	            }
/******/  	            hotRequestedFilesMap = {};
/******/  	            hotWaitingFilesMap = {};
/******/  	            hotAvailableFilesMap = update.c;
/******/  	            hotUpdateNewHash = update.h;
/******/
/******/  	            hotSetStatus("prepare");
/******/  	            var promise = new Promise(function (resolve, reject) {
/******/  	                hotDeferred = {
/******/  	                    resolve: resolve,
/******/  	                    reject: reject
/******/  	                };
/******/  	            });
/******/  	            hotUpdate = {};
/******/  	            var chunkId = 0;
/******/  	            { // eslint-disable-line no-lone-blocks
/******/  	                /*globals chunkId */
/******/  	                hotEnsureUpdateChunk(chunkId);
/******/  	            }
/******/  	            if (hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/  	                hotUpdateDownloaded();
/******/  	            }
/******/  	            return promise;
/******/  	        });
/******/  	    }
/******/
/******/  	    function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/  	        if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/  	            return;
/******/  	        hotRequestedFilesMap[chunkId] = false;
/******/  	        for (var moduleId in moreModules) {
/******/  	            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/  	                hotUpdate[moduleId] = moreModules[moduleId];
/******/  	            }
/******/  	        }
/******/  	        if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/  	            hotUpdateDownloaded();
/******/  	        }
/******/  	    }
/******/
/******/  	    function hotEnsureUpdateChunk(chunkId) {
/******/  	        if (!hotAvailableFilesMap[chunkId]) {
/******/  	            hotWaitingFilesMap[chunkId] = true;
/******/  	        } else {
/******/  	            hotRequestedFilesMap[chunkId] = true;
/******/  	            hotWaitingFiles++;
/******/  	            hotDownloadUpdateChunk(chunkId);
/******/  	        }
/******/  	    }
/******/
/******/  	    function hotUpdateDownloaded() {
/******/  	        hotSetStatus("ready");
/******/  	        var deferred = hotDeferred;
/******/  	        hotDeferred = null;
/******/  	        if (!deferred) return;
/******/  	        if (hotApplyOnUpdate) {
/******/  	            // Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/  	            // avoid triggering uncaught exception warning in Chrome.
/******/  	            // See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/  	            Promise.resolve().then(function () {
/******/  	                return hotApply(hotApplyOnUpdate);
/******/  	            }).then(
/******/  	                function (result) {
/******/  	                    deferred.resolve(result);
/******/  	                },
/******/  	                function (err) {
/******/  	                    deferred.reject(err);
/******/  	                }
/******/  	            );
/******/  	        } else {
/******/  	            var outdatedModules = [];
/******/  	            for (var id in hotUpdate) {
/******/  	                if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/  	                    outdatedModules.push(toModuleId(id));
/******/  	                }
/******/  	            }
/******/  	            deferred.resolve(outdatedModules);
/******/  	        }
/******/  	    }
/******/
/******/  	    function hotApply(options) {
/******/  	        if (hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/  	        options = options || {};
/******/
/******/  	        var cb;
/******/  	        var i;
/******/  	        var j;
/******/  	        var module;
/******/  	        var moduleId;
/******/
/******/  	        function getAffectedStuff(updateModuleId) {
/******/  	            var outdatedModules = [updateModuleId];
/******/  	            var outdatedDependencies = {};
/******/
/******/  	            var queue = outdatedModules.slice().map(function (id) {
/******/  	                return {
/******/  	                    chain: [id],
/******/  	                    id: id
/******/  	                };
/******/  	            });
/******/  	            while (queue.length > 0) {
/******/  	                var queueItem = queue.pop();
/******/  	                var moduleId = queueItem.id;
/******/  	                var chain = queueItem.chain;
/******/  	                module = installedModules[moduleId];
/******/  	                if (!module || module.hot._selfAccepted)
/******/  	                    continue;
/******/  	                if (module.hot._selfDeclined) {
/******/  	                    return {
/******/  	                        type: "self-declined",
/******/  	                        chain: chain,
/******/  	                        moduleId: moduleId
/******/  	                    };
/******/  	                }
/******/  	                if (module.hot._main) {
/******/  	                    return {
/******/  	                        type: "unaccepted",
/******/  	                        chain: chain,
/******/  	                        moduleId: moduleId
/******/  	                    };
/******/  	                }
/******/  	                for (var i = 0; i < module.parents.length; i++) {
/******/  	                    var parentId = module.parents[i];
/******/  	                    var parent = installedModules[parentId];
/******/  	                    if (!parent) continue;
/******/  	                    if (parent.hot._declinedDependencies[moduleId]) {
/******/  	                        return {
/******/  	                            type: "declined",
/******/  	                            chain: chain.concat([parentId]),
/******/  	                            moduleId: moduleId,
/******/  	                            parentId: parentId
/******/  	                        };
/******/  	                    }
/******/  	                    if (outdatedModules.indexOf(parentId) >= 0) continue;
/******/  	                    if (parent.hot._acceptedDependencies[moduleId]) {
/******/  	                        if (!outdatedDependencies[parentId])
/******/  	                            outdatedDependencies[parentId] = [];
/******/  	                        addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/  	                        continue;
/******/  	                    }
/******/  	                    delete outdatedDependencies[parentId];
/******/  	                    outdatedModules.push(parentId);
/******/  	                    queue.push({
/******/  	                        chain: chain.concat([parentId]),
/******/  	                        id: parentId
/******/  	                    });
/******/  	                }
/******/  	            }
/******/
/******/  	            return {
/******/  	                type: "accepted",
/******/  	                moduleId: updateModuleId,
/******/  	                outdatedModules: outdatedModules,
/******/  	                outdatedDependencies: outdatedDependencies
/******/  	            };
/******/  	        }
/******/
/******/  	        function addAllToSet(a, b) {
/******/  	            for (var i = 0; i < b.length; i++) {
/******/  	                var item = b[i];
/******/  	                if (a.indexOf(item) < 0)
/******/  	                    a.push(item);
/******/  	            }
/******/  	        }
/******/
/******/  	        // at begin all updates modules are outdated
/******/  	        // the "outdated" status can propagate to parents if they don't accept the children
/******/  	        var outdatedDependencies = {};
/******/  	        var outdatedModules = [];
/******/  	        var appliedUpdate = {};
/******/
/******/  	        var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/  	            console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/  	        };
/******/
/******/  	        for (var id in hotUpdate) {
/******/  	            if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/  	                moduleId = toModuleId(id);
/******/  	                var result;
/******/  	                if (hotUpdate[id]) {
/******/  	                    result = getAffectedStuff(moduleId);
/******/  	                } else {
/******/  	                    result = {
/******/  	                        type: "disposed",
/******/  	                        moduleId: id
/******/  	                    };
/******/  	                }
/******/  	                var abortError = false;
/******/  	                var doApply = false;
/******/  	                var doDispose = false;
/******/  	                var chainInfo = "";
/******/  	                if (result.chain) {
/******/  	                    chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/  	                }
/******/  	                switch (result.type) {
/******/  	                    case "self-declined":
/******/  	                        if (options.onDeclined)
/******/  	                            options.onDeclined(result);
/******/  	                        if (!options.ignoreDeclined)
/******/  	                            abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/  	                        break;
/******/  	                    case "declined":
/******/  	                        if (options.onDeclined)
/******/  	                            options.onDeclined(result);
/******/  	                        if (!options.ignoreDeclined)
/******/  	                            abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/  	                        break;
/******/  	                    case "unaccepted":
/******/  	                        if (options.onUnaccepted)
/******/  	                            options.onUnaccepted(result);
/******/  	                        if (!options.ignoreUnaccepted)
/******/  	                            abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/  	                        break;
/******/  	                    case "accepted":
/******/  	                        if (options.onAccepted)
/******/  	                            options.onAccepted(result);
/******/  	                        doApply = true;
/******/  	                        break;
/******/  	                    case "disposed":
/******/  	                        if (options.onDisposed)
/******/  	                            options.onDisposed(result);
/******/  	                        doDispose = true;
/******/  	                        break;
/******/  	                    default:
/******/  	                        throw new Error("Unexception type " + result.type);
/******/  	                }
/******/  	                if (abortError) {
/******/  	                    hotSetStatus("abort");
/******/  	                    return Promise.reject(abortError);
/******/  	                }
/******/  	                if (doApply) {
/******/  	                    appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/  	                    addAllToSet(outdatedModules, result.outdatedModules);
/******/  	                    for (moduleId in result.outdatedDependencies) {
/******/  	                        if (Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/  	                            if (!outdatedDependencies[moduleId])
/******/  	                                outdatedDependencies[moduleId] = [];
/******/  	                            addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/  	                        }
/******/  	                    }
/******/  	                }
/******/  	                if (doDispose) {
/******/  	                    addAllToSet(outdatedModules, [result.moduleId]);
/******/  	                    appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/  	                }
/******/  	            }
/******/  	        }
/******/
/******/  	        // Store self accepted outdated modules to require them later by the module system
/******/  	        var outdatedSelfAcceptedModules = [];
/******/  	        for (i = 0; i < outdatedModules.length; i++) {
/******/  	            moduleId = outdatedModules[i];
/******/  	            if (installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/  	                outdatedSelfAcceptedModules.push({
/******/  	                    module: moduleId,
/******/  	                    errorHandler: installedModules[moduleId].hot._selfAccepted
/******/  	                });
/******/  	        }
/******/
/******/  	        // Now in "dispose" phase
/******/  	        hotSetStatus("dispose");
/******/  	        Object.keys(hotAvailableFilesMap).forEach(function (chunkId) {
/******/  	            if (hotAvailableFilesMap[chunkId] === false) {
/******/  	                hotDisposeChunk(chunkId);
/******/  	            }
/******/  	        });
/******/
/******/  	        var idx;
/******/  	        var queue = outdatedModules.slice();
/******/  	        while (queue.length > 0) {
/******/  	            moduleId = queue.pop();
/******/  	            module = installedModules[moduleId];
/******/  	            if (!module) continue;
/******/
/******/  	            var data = {};
/******/
/******/  	            // Call dispose handlers
/******/  	            var disposeHandlers = module.hot._disposeHandlers;
/******/  	            for (j = 0; j < disposeHandlers.length; j++) {
/******/  	                cb = disposeHandlers[j];
/******/  	                cb(data);
/******/  	            }
/******/  	            hotCurrentModuleData[moduleId] = data;
/******/
/******/  	            // disable module (this disables requires from this module)
/******/  	            module.hot.active = false;
/******/
/******/  	            // remove module from cache
/******/  	            delete installedModules[moduleId];
/******/
/******/  	            // when disposing there is no need to call dispose handler
/******/  	            delete outdatedDependencies[moduleId];
/******/
/******/  	            // remove "parents" references from all children
/******/  	            for (j = 0; j < module.children.length; j++) {
/******/  	                var child = installedModules[module.children[j]];
/******/  	                if (!child) continue;
/******/  	                idx = child.parents.indexOf(moduleId);
/******/  	                if (idx >= 0) {
/******/  	                    child.parents.splice(idx, 1);
/******/  	                }
/******/  	            }
/******/  	        }
/******/
/******/  	        // remove outdated dependency from module children
/******/  	        var dependency;
/******/  	        var moduleOutdatedDependencies;
/******/  	        for (moduleId in outdatedDependencies) {
/******/  	            if (Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/  	                module = installedModules[moduleId];
/******/  	                if (module) {
/******/  	                    moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/  	                    for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/  	                        dependency = moduleOutdatedDependencies[j];
/******/  	                        idx = module.children.indexOf(dependency);
/******/  	                        if (idx >= 0) module.children.splice(idx, 1);
/******/  	                    }
/******/  	                }
/******/  	            }
/******/  	        }
/******/
/******/  	        // Not in "apply" phase
/******/  	        hotSetStatus("apply");
/******/
/******/  	        hotCurrentHash = hotUpdateNewHash;
/******/
/******/  	        // insert new code
/******/  	        for (moduleId in appliedUpdate) {
/******/  	            if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/  	                modules[moduleId] = appliedUpdate[moduleId];
/******/  	            }
/******/  	        }
/******/
/******/  	        // call accept handlers
/******/  	        var error = null;
/******/  	        for (moduleId in outdatedDependencies) {
/******/  	            if (Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/  	                module = installedModules[moduleId];
/******/  	                if (module) {
/******/  	                    moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/  	                    var callbacks = [];
/******/  	                    for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/  	                        dependency = moduleOutdatedDependencies[i];
/******/  	                        cb = module.hot._acceptedDependencies[dependency];
/******/  	                        if (cb) {
/******/  	                            if (callbacks.indexOf(cb) >= 0) continue;
/******/  	                            callbacks.push(cb);
/******/  	                        }
/******/  	                    }
/******/  	                    for (i = 0; i < callbacks.length; i++) {
/******/  	                        cb = callbacks[i];
/******/  	                        try {
/******/  	                            cb(moduleOutdatedDependencies);
/******/  	                        } catch (err) {
/******/  	                            if (options.onErrored) {
/******/  	                                options.onErrored({
/******/  	                                    type: "accept-errored",
/******/  	                                    moduleId: moduleId,
/******/  	                                    dependencyId: moduleOutdatedDependencies[i],
/******/  	                                    error: err
/******/  	                                });
/******/  	                            }
/******/  	                            if (!options.ignoreErrored) {
/******/  	                                if (!error)
/******/  	                                    error = err;
/******/  	                            }
/******/  	                        }
/******/  	                    }
/******/  	                }
/******/  	            }
/******/  	        }
/******/
/******/  	        // Load self accepted modules
/******/  	        for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/  	            var item = outdatedSelfAcceptedModules[i];
/******/  	            moduleId = item.module;
/******/  	            hotCurrentParents = [moduleId];
/******/  	            try {
/******/  	                __webpack_require__(moduleId);
/******/  	            } catch (err) {
/******/  	                if (typeof item.errorHandler === "function") {
/******/  	                    try {
/******/  	                        item.errorHandler(err);
/******/  	                    } catch (err2) {
/******/  	                        if (options.onErrored) {
/******/  	                            options.onErrored({
/******/  	                                type: "self-accept-error-handler-errored",
/******/  	                                moduleId: moduleId,
/******/  	                                error: err2,
/******/  	                                orginalError: err, // TODO remove in webpack 4
/******/  	                                originalError: err
/******/  	                            });
/******/  	                        }
/******/  	                        if (!options.ignoreErrored) {
/******/  	                            if (!error)
/******/  	                                error = err2;
/******/  	                        }
/******/  	                        if (!error)
/******/  	                            error = err;
/******/  	                    }
/******/  	                } else {
/******/  	                    if (options.onErrored) {
/******/  	                        options.onErrored({
/******/  	                            type: "self-accept-errored",
/******/  	                            moduleId: moduleId,
/******/  	                            error: err
/******/  	                        });
/******/  	                    }
/******/  	                    if (!options.ignoreErrored) {
/******/  	                        if (!error)
/******/  	                            error = err;
/******/  	                    }
/******/  	                }
/******/  	            }
/******/  	        }
/******/
/******/  	        // handle errors in accept handlers and self accepted module load
/******/  	        if (error) {
/******/  	            hotSetStatus("fail");
/******/  	            return Promise.reject(error);
/******/  	        }
/******/
/******/  	        hotSetStatus("idle");
/******/  	        return new Promise(function (resolve) {
/******/  	            resolve(outdatedModules);
/******/  	        });
/******/  	    }
/******/
/******/  	// The module cache
/******/  	var installedModules = {};
/******/  	// objects to store loaded and loading chunks
/******/  	var installedChunks = {
/******/  		1: 0
/******/  	};
/******/
/******/  	function __webpack_require__(moduleId) {
/******/  		if (installedModules[moduleId]) {
/******/  			return installedModules[moduleId].exports;
/******/  		}
/******/  		var module = installedModules[moduleId] = {
/******/  			i: moduleId,
/******/  			l: false,
/******/  			exports: {},
/******/  			hot: hotCreateModule(moduleId),
/******/  			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/  			children: []
/******/  		};
/******/  		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/  		module.l = true;
/******/  		return module.exports;
/******/  	}
/******/
/******/  	// expose the modules object (__webpack_modules__)
/******/  	__webpack_require__.m = modules;
/******/
/******/  	// expose the module cache
/******/  	__webpack_require__.c = installedModules;
/******/
/******/  	// define getter function for harmony exports
/******/  	__webpack_require__.d = function(exports, name, getter) {
/******/  		if(!__webpack_require__.o(exports, name)) {
/******/  			Object.defineProperty(exports, name, {
/******/  				configurable: false,
/******/  				enumerable: true,
/******/  				get: getter
/******/  			});
/******/  		}
/******/  	};
/******/
/******/  	// getDefaultExport function for compatibility with non-harmony modules
/******/  	__webpack_require__.n = function(module) {
/******/  		var getter = module && module.__esModule ?
/******/  		function getDefault() { return module['default']; } :
/******/  		function getModuleExports() { return module; };
/******/  		__webpack_require__.d(getter, 'a', getter);
/******/  		return getter;
/******/  	};
/******/
/******/  	// Object.prototype.hasOwnProperty.call
/******/  	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/  	// __webpack_public_path__
/******/  	__webpack_require__.p = "/dist/";
/******/
/******/  	// This file contains only the entry chunk.
/******/  	// The chunk loading function for additional chunks
/******/  	__webpack_require__.e = function requireEnsure(chunkId) {
/******/  		var installedChunkData = installedChunks[chunkId];
/******/  			if(installedChunkData === 0) {
/******/  				return new Promise(function(resolve) { resolve(); });
/******/  			}
/******/
/******/  		// a Promise means "currently loading".
/******/  		if(installedChunkData) {
/******/  			return installedChunkData[2];
/******/  		}
/******/
/******/  		// setup Promise in chunk cache
/******/  		var promise = new Promise(function(resolve, reject) {
/******/  			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/  		});
/******/  		installedChunkData[2] = promise;
/******/
/******/  		// start chunk loading
/******/  		var head = document.getElementsByTagName("head")[0];
/******/  		var script = document.createElement("script");
/******/  		script.type = "text/javascript";
/******/  		script.async = true;
/******/  		script.timeout = 120000;
/******/
/******/  		if (__webpack_require__.nc) {
/******/  			script.setAttribute("nonce", __webpack_require__.nc);
/******/  		}
/******/  		script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";
/******/  		var timeout = setTimeout(onScriptComplete, 120000);
/******/  		script.onerror = script.onload = onScriptComplete;
/******/  		function onScriptComplete() {
/******/  			// avoid mem leaks in IE.
/******/  			script.onerror = script.onload = null;
/******/  			clearTimeout(timeout);
/******/  			var chunk = installedChunks[chunkId];
/******/  			if(chunk !== 0) {
/******/  				if(chunk) {
/******/  					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/  				}
/******/  				installedChunks[chunkId] = undefined;
/******/  			}
/******/  		}
/******/  		head.appendChild(script);
/******/
/******/  		return promise;
/******/  	};
/******/  	// on error function for async loading
/******/  	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/  	// __webpack_hash__
/******/  	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/  	// Load entry module and return exports
/******/  	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
__webpack_require__(1)
__webpack_require__.e(0).then(function () {

})

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {
const a = 1;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {
var a = 1;var b=2;{a=b};

__webpack_require__(3);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {
__webpack_require__(4)

console.log('test.js')

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = __webpack_require__(5);
var util = __webpack_require__(6);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(7);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {
'use strict';

exports.decode = exports.parse = __webpack_require__(8);
exports.encode = exports.stringify = __webpack_require__(9);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

/***/ })
/******/ ]);