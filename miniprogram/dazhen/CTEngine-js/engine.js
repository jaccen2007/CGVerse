/*
迭代引擎需要修改asmLibraryArg和ASM_CONSTS，并按报错增添新增加的自动生成函数，
如果出现在BindingError: function throwBindingError(message)
取消console.log(name)的注释
观察卡在哪个函数，添加createNamedFunction中的对应函数
*/ 
import m_fetch from "fetch.js";
var CTEngine = (() => {
  return function (CTEngine) {
    CTEngine = CTEngine || {};
    var Module = typeof CTEngine != "undefined" ? CTEngine : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = true;
    var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
    var ENVIRONMENT_IS_NODE =
      typeof process == "object" &&
      typeof process.versions == "object" &&
      typeof process.versions.node == "string";
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary, setWindowTitle;
    function logExceptionOnExit(e) {
      if (e instanceof ExitStatus) return;
      let toLog = e;
      err("exiting due to exception: " + toLog);
    }
    var fs;
    var nodePath;
    var requireNodeFS;
    if (ENVIRONMENT_IS_NODE) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = require("path").dirname(scriptDirectory) + "/";
      } else {
        scriptDirectory = __dirname + "/";
      }
      requireNodeFS = () => {
        if (!nodePath) {
          fs = require("fs");
          nodePath = require("path");
        }
      };
      read_ = function shell_read(filename, binary) {
        requireNodeFS();
        filename = nodePath["normalize"](filename);
        return fs.readFileSync(filename, binary ? undefined : "utf8");
      };
      readBinary = (filename) => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        return ret;
      };
      readAsync = (filename, onload, onerror) => {
        requireNodeFS();
        filename = nodePath["normalize"](filename);
        fs.readFile(filename, function (err, data) {
          if (err) onerror(err);
          else onload(data.buffer);
        });
      };
      if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/");
      }
      arguments_ = process["argv"].slice(2);
      process["on"]("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      });
      process["on"]("unhandledRejection", function (reason) {
        throw reason;
      });
      quit_ = (status, toThrow) => {
        if (keepRuntimeAlive()) {
          process["exitCode"] = status;
          throw toThrow;
        }
        logExceptionOnExit(toThrow);
        process["exit"](status);
      };
      Module["inspect"] = function () {
        return "[Emscripten Module object]";
      };
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(
          0,
          scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1
        );
      } else {
        scriptDirectory = "";
      }
      {
        read_ = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
      setWindowTitle = (title) => (document.title = title);
    } else {
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var tempRet0 = 0;
    var setTempRet0 = (value) => {
      tempRet0 = value;
    };
    var getTempRet0 = () => tempRet0;
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WXWebAssembly != "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    function assert(condition, text) {
      if (!condition) {
        abort(text);
      }
    }
    var UTF8Decoder =
      typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
    function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      } else {
        var str = "";
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
          } else {
            u0 =
              ((u0 & 7) << 18) |
              (u1 << 12) |
              (u2 << 6) |
              (heapOrArray[idx++] & 63);
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
          }
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
          u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4;
      }
      return len;
    }
    var UTF16Decoder =
      typeof TextDecoder != "undefined"
        ? new TextDecoder("utf-16le")
        : undefined;
    function UTF16ToString(ptr, maxBytesToRead) {
      var endPtr = ptr;
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
      if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      } else {
        var str = "";
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[(ptr + i * 2) >> 1];
          if (codeUnit == 0) break;
          str += String.fromCharCode(codeUnit);
        }
        return str;
      }
    }
    function stringToUTF16(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite =
        maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      HEAP16[outPtr >> 1] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF16(str) {
      return str.length * 2;
    }
    function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0;
      var str = "";
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(ptr + i * 4) >> 2];
        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    }
    function stringToUTF32(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === undefined) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit =
            (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      HEAP32[outPtr >> 2] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF32(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }
      return len;
    }
    function writeArrayToMemory(array, buffer) {
      HEAP8.set(array, buffer);
    }
    function writeAsciiToMemory(str, buffer, dontAddNull) {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i);
      }
      if (!dontAddNull) HEAP8[buffer >> 0] = 0;
    }
    var buffer,
      HEAP8,
      HEAPU8,
      HEAP16,
      HEAPU16,
      HEAP32,
      HEAPU32,
      HEAPF32,
      HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function keepRuntimeAlive() {
      return noExitRuntime;
    }
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
      FS.ignorePermissions = false;
      TTY.init();
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function getUniqueRunDependency(id) {
      return id;
    }
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      {
        if(what=="randomDevice")
          return ;
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
      }
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += ". Build with -sASSERTIONS for more info.";
      console.error(what);
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    function isFileURI(filename) {
      return filename.startsWith("file://");
    }
    var wasmBinaryFile;
    wasmBinaryFile = "/pages/engine1.wasm";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function createWasm() {
      var info = { a: asmLibraryArg };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["tc"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["vc"];
        addOnInit(Module["asm"]["uc"]);
        removeRunDependency("wasm-instantiate");
      }
      addRunDependency("wasm-instantiate");
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return WXWebAssembly.instantiate("/dazhen/wasm/engine.wasm.br", info)
          .then(function (instance) {
            return instance;
          })
          .then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason);
          });
      }
      function instantiateAsync() {
        if (
          !wasmBinary &&
          typeof WXWebAssembly.instantiateStreaming == "function" &&
          !isDataURI(wasmBinaryFile) &&
          !isFileURI(wasmBinaryFile) &&
          !ENVIRONMENT_IS_NODE &&
          typeof fetch == "function"
        ) {
          return m_fetch
            .fetch(wasmBinaryFile, { credentials: "same-origin" })
            .then(function (response) {
              var result = WXWebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function (reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            });
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    var tempDouble;
    var tempI64;
    var ASM_CONSTS = {
      1401148: () => {
        const options = getApp().globalData.CTEngine_glOptions;
        const context = getApp().globalData.CTEngine_glContext;
        const handle = GL.registerContext(context, options);
        getApp().globalData.CTEngine_contextHandle = handle;
        GL.makeContextCurrent(handle);
      },
      1401362: () => {
        const handle = getApp().globalData.CTEngine_contextHandle;
        GL.makeContextCurrent(handle);
      },
      1401443: ($0, $1, $2, $3, $4, $5) => {
        const fn = Emval.toValue($0);
        fn({
          renderable: Emval.toValue($1),
          depth: $2,
          fragCoords: [$3, $4, $5],
        });
      },
      1401560: () => {
        // if(typeof window==="undefined"||(window.AudioContext||window.webkitAudioContext)===undefined){return 0}
        if (typeof getApp().globalData.miniaudio === "undefined") {
          getApp().globalData.miniaudio = { referenceCount: 0 };
          var miniaudio = getApp().globalData.miniaudio;
          miniaudio.devices = [];
          miniaudio.track_device = function (device) {
            for (
              var iDevice = 0;
              iDevice < miniaudio.devices.length;
              ++iDevice
            ) {
              if (miniaudio.devices[iDevice] == null) {
                miniaudio.devices[iDevice] = device;
                return iDevice;
              }
            }
            miniaudio.devices.push(device);
            return miniaudio.devices.length - 1;
          };
          miniaudio.untrack_device_by_index = function (deviceIndex) {
            miniaudio.devices[deviceIndex] = null;
            while (miniaudio.devices.length > 0) {
              if (miniaudio.devices[miniaudio.devices.length - 1] == null) {
                miniaudio.devices.pop();
              } else {
                break;
              }
            }
          };
          miniaudio.untrack_device = function (device) {
            for (
              var iDevice = 0;
              iDevice < miniaudio.devices.length;
              ++iDevice
            ) {
              if (miniaudio.devices[iDevice] == device) {
                return miniaudio.untrack_device_by_index(iDevice);
              }
            }
          };
          miniaudio.get_device_by_index = function (deviceIndex) {
            return miniaudio.devices[deviceIndex];
          };
          miniaudio.unlock_event_types = (function () {
            return ["touchstart", "touchend", "click"];
          })();
          miniaudio.unlock = function () {
            for (var i = 0; i < miniaudio.devices.length; ++i) {
              var device = miniaudio.devices[i];
              if (
                device != null &&
                device.webaudio != null &&
                device.state === 2
              ) {
                device.webaudio.resume();
              }
            }
            miniaudio.unlock_event_types.map(function (event_type) {
              //document.removeEventListener(event_type,miniaudio.unlock,true)
            });
          };
          miniaudio.unlock_event_types.map(function (event_type) {
            //document.addEventListener(event_type,miniaudio.unlock,true)
          });
        }
        getApp().globalData.miniaudio.referenceCount++;
        return 1;
      },
      1403259: () => {
        if (typeof getApp().globalData.miniaudio !== "undefined") {
          getApp().globalData.miniaudio.referenceCount--;
          if (getApp().globalData.miniaudio.referenceCount === 0) {
            delete getApp().globalData.miniaudio;
          }
        }
      },
      1403420: () => {
        return (
          navigator.mediaDevices !== undefined &&
          navigator.mediaDevices.getUserMedia !== undefined
        );
      },
      1403524: () => {
        try {
          var temp =
            getApp().globalData.AudioContext ||
            getApp().globalData.webkitAudioContext;
          var sampleRate = temp.sampleRate;
          //temp.close();
          //console.log("close temp")
          return sampleRate;
        } catch (e) {
          return 0;
        }
      },
      1403695: ($0, $1, $2, $3, $4) => {
        var channels = $0;
        var sampleRate = $1;
        var bufferSize = $2;
        var isCapture = $3;
        var pDevice = $4;
        var miniaudio = getApp().globalData.miniaudio;
        if (typeof getApp().globalData.miniaudio === "undefined") {
          return -1;
        }
        var device = {};
        getApp().globalData.AudioContext = wx.createWebAudioContext();

        device.webaudio =
          getApp().globalData.AudioContext ||
          getApp().globalData.webkitAudioContext;
        device.webaudio.suspend();
        device.state = 1;
        device.intermediaryBufferSizeInBytes = channels * bufferSize * 4;
        device.intermediaryBuffer = Module._malloc(
          device.intermediaryBufferSizeInBytes
        );
        device.intermediaryBufferView = new Float32Array(
          Module.HEAPF32.buffer,
          device.intermediaryBuffer,
          device.intermediaryBufferSizeInBytes
        );
        device.scriptNode = device.webaudio.createScriptProcessor(
          bufferSize,
          isCapture ? channels : 1,
          isCapture ? 0 : channels
        );
        if (isCapture) {
          device.scriptNode.onaudioprocess = function (e) {
            if (device.intermediaryBuffer === undefined) {
              return;
            }
            if (device.intermediaryBufferView.length == 0) {
              device.intermediaryBufferView = new Float32Array(
                Module.HEAPF32.buffer,
                device.intermediaryBuffer,
                device.intermediaryBufferSizeInBytes
              );
            }
            for (
              var iChannel = 0;
              iChannel < e.outputBuffer.numberOfChannels;
              ++iChannel
            ) {
              e.outputBuffer.getChannelData(iChannel).fill(0);
            }
            var sendSilence = false;
            if (device.streamNode === undefined) {
              sendSilence = true;
            }
            if (e.inputBuffer.numberOfChannels != channels) {
              console.log(
                "Capture: Channel count mismatch. " +
                  e.inputBufer.numberOfChannels +
                  " != " +
                  channels +
                  ". Sending silence."
              );
              sendSilence = true;
            }
            var totalFramesProcessed = 0;
            while (totalFramesProcessed < e.inputBuffer.length) {
              var framesRemaining = e.inputBuffer.length - totalFramesProcessed;
              var framesToProcess = framesRemaining;
              if (
                framesToProcess >
                device.intermediaryBufferSizeInBytes / channels / 4
              ) {
                framesToProcess =
                  device.intermediaryBufferSizeInBytes / channels / 4;
              }
              if (sendSilence) {
                device.intermediaryBufferView.fill(0);
              } else {
                for (var iFrame = 0; iFrame < framesToProcess; ++iFrame) {
                  for (
                    var iChannel = 0;
                    iChannel < e.inputBuffer.numberOfChannels;
                    ++iChannel
                  ) {
                    device.intermediaryBufferView[
                      iFrame * channels + iChannel
                    ] =
                      e.inputBuffer.getChannelData(iChannel)[
                        totalFramesProcessed + iFrame
                      ];
                  }
                }
              }
              _ma_device_process_pcm_frames_capture__webaudio(
                pDevice,
                framesToProcess,
                device.intermediaryBuffer
              );
              totalFramesProcessed += framesToProcess;
            }
          };
          navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(function (stream) {
              device.streamNode =
                device.webaudio.createMediaStreamSource(stream);
              device.streamNode.connect(device.scriptNode);
              device.scriptNode.connect(device.webaudio.destination);
            })
            .catch(function (error) {
              device.scriptNode.connect(device.webaudio.destination);
            });
        } else {
          device.scriptNode.onaudioprocess = function (e) {
            if (device.intermediaryBuffer === undefined) {
              return;
            }
            if (device.intermediaryBufferView.length == 0) {
              device.intermediaryBufferView = new Float32Array(
                Module.HEAPF32.buffer,
                device.intermediaryBuffer,
                device.intermediaryBufferSizeInBytes
              );
            }
            var outputSilence = false;
            if (e.outputBuffer.numberOfChannels != channels) {
              console.log(
                "Playback: Channel count mismatch. " +
                  e.outputBufer.numberOfChannels +
                  " != " +
                  channels +
                  ". Outputting silence."
              );
              outputSilence = true;
              return;
            }
            var totalFramesProcessed = 0;
            while (totalFramesProcessed < e.outputBuffer.length) {
              var framesRemaining =
                e.outputBuffer.length - totalFramesProcessed;
              var framesToProcess = framesRemaining;
              if (
                framesToProcess >
                device.intermediaryBufferSizeInBytes / channels / 4
              ) {
                framesToProcess =
                  device.intermediaryBufferSizeInBytes / channels / 4;
              }
              _ma_device_process_pcm_frames_playback__webaudio(
                pDevice,
                framesToProcess,
                device.intermediaryBuffer
              );
              if (outputSilence) {
                for (
                  var iChannel = 0;
                  iChannel < e.outputBuffer.numberOfChannels;
                  ++iChannel
                ) {
                  e.outputBuffer.getChannelData(iChannel).fill(0);
                }
              } else {
                for (
                  var iChannel = 0;
                  iChannel < e.outputBuffer.numberOfChannels;
                  ++iChannel
                ) {
                  var outputBuffer = e.outputBuffer.getChannelData(iChannel);
                  var intermediaryBuffer = device.intermediaryBufferView;
                  for (var iFrame = 0; iFrame < framesToProcess; ++iFrame) {
                    outputBuffer[totalFramesProcessed + iFrame] =
                      intermediaryBuffer[iFrame * channels + iChannel];
                  }
                }
              }
              totalFramesProcessed += framesToProcess;
            }
          };
          device.scriptNode.connect(device.webaudio.destination);
        }
        return miniaudio.track_device(device);
      },
      1407985: ($0) => {
        var miniaudio = getApp().globalData.miniaudio;
        return miniaudio.get_device_by_index($0).webaudio.sampleRate;
      },
      1408051: ($0) => {
        var miniaudio = getApp().globalData.miniaudio;
        var device = miniaudio.get_device_by_index($0);
        if (device.scriptNode !== undefined) {
          device.scriptNode.onaudioprocess = function (e) {};
          device.scriptNode.disconnect();
          device.scriptNode = undefined;
        }
        if (device.streamNode !== undefined) {
          device.streamNode.disconnect();
          device.streamNode = undefined;
        }
        device.webaudio.close();
        device.webaudio = undefined;
        if (device.intermediaryBuffer !== undefined) {
          Module._free(device.intermediaryBuffer);
          device.intermediaryBuffer = undefined;
          device.intermediaryBufferView = undefined;
          device.intermediaryBufferSizeInBytes = undefined;
        }
        miniaudio.untrack_device_by_index($0);
      },
      1408677: ($0) => {
        var miniaudio = getApp().globalData.miniaudio;
        var device = miniaudio.get_device_by_index($0);
        device.webaudio.resume();
        device.state = 2;
      },
      1408773: ($0) => {
        var miniaudio = getApp().globalData.miniaudio;
        var device = miniaudio.get_device_by_index($0);
        device.webaudio.resume();
        device.state = 2;
      },
      1408869: ($0) => {
        var device = miniaudio.get_device_by_index($0);
        device.webaudio.suspend();
        device.state = 1;
      },
      1408966: ($0) => {
        var miniaudio = getApp().globalData.miniaudio;
        var device = miniaudio.get_device_by_index($0);
        device.webaudio.suspend();
        device.state = 1;
      },
    };
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    }
    var wasmTableMirror = [];
    function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length)
          wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    }
    function setErrNo(value) {
      HEAP32[___errno_location() >> 2] = value;
      return value;
    }
    var PATH = {
      isAbs: (path) => path.charAt(0) === "/",
      splitPath: (filename) => {
        var splitPathRe =
          /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
      normalizeArray: (parts, allowAboveRoot) => {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..");
          }
        }
        return parts;
      },
      normalize: (path) => {
        var isAbsolute = PATH.isAbs(path),
          trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(
          path.split("/").filter((p) => !!p),
          !isAbsolute
        ).join("/");
        if (!path && !isAbsolute) {
          path = ".";
        }
        if (path && trailingSlash) {
          path += "/";
        }
        return (isAbsolute ? "/" : "") + path;
      },
      dirname: (path) => {
        var result = PATH.splitPath(path),
          root = result[0],
          dir = result[1];
        if (!root && !dir) {
          return ".";
        }
        if (dir) {
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },
      basename: (path) => {
        if (path === "/") return "/";
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1);
      },
      join: function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"));
      },
      join2: (l, r) => {
        return PATH.normalize(l + "/" + r);
      },
    };
    function getRandomDevice() {
      if (
        typeof crypto == "object" &&
        typeof crypto["getRandomValues"] == "function"
      ) {
        var randomBuffer = new Uint8Array(1);
        return function () {
          crypto.getRandomValues(randomBuffer);
          return randomBuffer[0];
        };
      } else if (ENVIRONMENT_IS_NODE) {
        try {
          var crypto_module = require("crypto");
          return function () {
            return crypto_module["randomBytes"](1)[0];
          };
        } catch (e) {}
      }
      return function () {
        abort("randomDevice");
      };
    }
    var PATH_FS = {
      resolve: function () {
        var resolvedPath = "",
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? arguments[i] : FS.cwd();
          if (typeof path != "string") {
            throw new TypeError("Arguments to path.resolve must be strings");
          } else if (!path) {
            return "";
          }
          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        resolvedPath = PATH.normalizeArray(
          resolvedPath.split("/").filter((p) => !!p),
          !resolvedAbsolute
        ).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
      },
      relative: (from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== "") break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== "") break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push("..");
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
      },
    };
    var TTY = {
      ttys: [],
      init: function () {},
      shutdown: function () {},
      register: function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
      stream_ops: {
        open: function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
        close: function (stream) {
          stream.tty.ops.flush(stream.tty);
        },
        flush: function (stream) {
          stream.tty.ops.flush(stream.tty);
        },
        read: function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },
        write: function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        },
      },
      default_tty_ops: {
        get_char: function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
              try {
                bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
              } catch (e) {
                if (e.toString().includes("EOF")) bytesRead = 0;
                else throw e;
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (
              typeof window != "undefined" &&
              typeof window.prompt == "function"
            ) {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },
        put_char: function (tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        flush: function (tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
      },
      default_tty1_ops: {
        put_char: function (tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
        flush: function (tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        },
      },
    };
    function zeroMemory(address, size) {
      HEAPU8.fill(0, address, address + size);
    }
    function alignMemory(size, alignment) {
      return Math.ceil(size / alignment) * alignment;
    }
    function mmapAlloc(size) {
      size = alignMemory(size, 65536);
      var ptr = _emscripten_builtin_memalign(65536, size);
      if (!ptr) return 0;
      zeroMemory(ptr, size);
      return ptr;
    }
    var MEMFS = {
      ops_table: null,
      mount: function (mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0);
      },
      createNode: function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink,
              },
              stream: { llseek: MEMFS.stream_ops.llseek },
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync,
              },
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink,
              },
              stream: {},
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
              },
              stream: FS.chrdev_stream_ops,
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;
          node.contents = null;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },
      getFileDataAsTypedArray: function (node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray)
          return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
      },
      expandFileStorage: function (node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(
          newCapacity,
          (prevCapacity *
            (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
            0
        );
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0)
          node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
      },
      resizeFileStorage: function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null;
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          if (oldContents) {
            node.contents.set(
              oldContents.subarray(0, Math.min(newSize, node.usedBytes))
            );
          }
          node.usedBytes = newSize;
        }
      },
      node_ops: {
        getattr: function (node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
        setattr: function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
        lookup: function (parent, name) {
          throw FS.genericErrors[44];
        },
        mknod: function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
        rename: function (old_node, new_dir, new_name) {
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {}
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now();
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        },
        unlink: function (parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
        rmdir: function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },
        readdir: function (node) {
          var entries = [".", ".."];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },
        symlink: function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        },
        readlink: function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
      },
      stream_ops: {
        read: function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++)
              buffer[offset + i] = contents[position + i];
          }
          return size;
        },
        write: function (stream, buffer, offset, length, position, canOwn) {
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(
                buffer.subarray(offset, offset + length),
                position
              );
              return length;
            }
          }
          MEMFS.expandFileStorage(node, position + length);
          if (node.contents.subarray && buffer.subarray) {
            node.contents.set(
              buffer.subarray(offset, offset + length),
              position
            );
          } else {
            for (var i = 0; i < length; i++) {
              node.contents[position + i] = buffer[offset + i];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
        llseek: function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
        allocate: function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(
            stream.node.usedBytes,
            offset + length
          );
        },
        mmap: function (stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents.buffer === buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(
                  contents,
                  position,
                  position + length
                );
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },
        msync: function (stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (mmapFlags & 2) {
            return 0;
          }
          var bytesWritten = MEMFS.stream_ops.write(
            stream,
            buffer,
            0,
            length,
            offset,
            false
          );
          return 0;
        },
      },
    };
    function asyncLoad(url, onload, onerror, noRunDep) {
      var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
      readAsync(
        url,
        function (arrayBuffer) {
          assert(
            arrayBuffer,
            'Loading data file "' + url + '" failed (no arrayBuffer).'
          );
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        },
        function (event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        }
      );
      if (dep) addRunDependency(dep);
    }
    var FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: false,
      ignorePermissions: true,
      ErrnoError: null,
      genericErrors: {},
      filesystems: null,
      syncFSRequests: 0,
      lookupPath: (path, opts = {}) => {
        path = PATH_FS.resolve(FS.cwd(), path);
        if (!path) return { path: "", node: null };
        var defaults = { follow_mount: true, recurse_count: 0 };
        opts = Object.assign(defaults, opts);
        if (opts.recurse_count > 8) {
          throw new FS.ErrnoError(32);
        }
        var parts = PATH.normalizeArray(
          path.split("/").filter((p) => !!p),
          false
        );
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
          var islast = i === parts.length - 1;
          if (islast && opts.parent) {
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, {
                recurse_count: opts.recurse_count + 1,
              });
              current = lookup.node;
              if (count++ > 40) {
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },
      getPath: (node) => {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length - 1] !== "/"
              ? mount + "/" + path
              : mount + path;
          }
          path = path ? node.name + "/" + path : node.name;
          node = node.parent;
        }
      },
      hashName: (parentid, name) => {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
      hashAddNode: (node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
      hashRemoveNode: (node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
      lookupNode: (parent, name) => {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        return FS.lookup(parent, name);
      },
      createNode: (parent, name, mode, rdev) => {
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
      },
      destroyNode: (node) => {
        FS.hashRemoveNode(node);
      },
      isRoot: (node) => {
        return node === node.parent;
      },
      isMountpoint: (node) => {
        return !!node.mounted;
      },
      isFile: (mode) => {
        return (mode & 61440) === 32768;
      },
      isDir: (mode) => {
        return (mode & 61440) === 16384;
      },
      isLink: (mode) => {
        return (mode & 61440) === 40960;
      },
      isChrdev: (mode) => {
        return (mode & 61440) === 8192;
      },
      isBlkdev: (mode) => {
        return (mode & 61440) === 24576;
      },
      isFIFO: (mode) => {
        return (mode & 61440) === 4096;
      },
      isSocket: (mode) => {
        return (mode & 49152) === 49152;
      },
      flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
      modeStringToFlags: (str) => {
        var flags = FS.flagModes[str];
        if (typeof flags == "undefined") {
          throw new Error("Unknown file open mode: " + str);
        }
        return flags;
      },
      flagsToPermissionString: (flag) => {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
          perms += "w";
        }
        return perms;
      },
      nodePermissions: (node, perms) => {
        if (FS.ignorePermissions) {
          return 0;
        }
        if (perms.includes("r") && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes("w") && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes("x") && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
      mayLookup: (dir) => {
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
      mayCreate: (dir, name) => {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {}
        return FS.nodePermissions(dir, "wx");
      },
      mayDelete: (dir, name, isdir) => {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
      mayOpen: (node, flags) => {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
      MAX_OPEN_FDS: 4096,
      nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
      getStream: (fd) => FS.streams[fd],
      createStream: (stream, fd_start, fd_end) => {
        if (!FS.FSStream) {
          FS.FSStream = function () {
            this.shared = {};
          };
          FS.FSStream.prototype = {};
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function () {
                return this.node;
              },
              set: function (val) {
                this.node = val;
              },
            },
            isRead: {
              get: function () {
                return (this.flags & 2097155) !== 1;
              },
            },
            isWrite: {
              get: function () {
                return (this.flags & 2097155) !== 0;
              },
            },
            isAppend: {
              get: function () {
                return this.flags & 1024;
              },
            },
            flags: {
              get: function () {
                return this.shared.flags;
              },
              set: function (val) {
                this.shared.flags = val;
              },
            },
            position: {
              get: function () {
                return this.shared.position;
              },
              set: function (val) {
                this.shared.position = val;
              },
            },
          });
        }
        stream = Object.assign(new FS.FSStream(), stream);
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
      closeStream: (fd) => {
        FS.streams[fd] = null;
      },
      chrdev_stream_ops: {
        open: (stream) => {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },
        llseek: () => {
          throw new FS.ErrnoError(70);
        },
      },
      major: (dev) => dev >> 8,
      minor: (dev) => dev & 255,
      makedev: (ma, mi) => (ma << 8) | mi,
      registerDevice: (dev, ops) => {
        FS.devices[dev] = { stream_ops: ops };
      },
      getDevice: (dev) => FS.devices[dev],
      getMounts: (mount) => {
        var mounts = [];
        var check = [mount];
        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push.apply(check, m.mounts);
        }
        return mounts;
      },
      syncfs: (populate, callback) => {
        if (typeof populate == "function") {
          callback = populate;
          populate = false;
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
          err(
            "warning: " +
              FS.syncFSRequests +
              " FS.syncfs operations in flight at once, probably just doing extra work"
          );
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function doCallback(errCode) {
          FS.syncFSRequests--;
          return callback(errCode);
        }
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        }
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },
      mount: (type, opts, mountpoint) => {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          mountpoint = lookup.path;
          node = lookup.node;
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: [],
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          node.mounted = mount;
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
        return mountRoot;
      },
      unmount: (mountpoint) => {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
          while (current) {
            var next = current.name_next;
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
            current = next;
          }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      },
      lookup: (parent, name) => {
        return parent.node_ops.lookup(parent, name);
      },
      mknod: (path, mode, dev) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
      create: (path, mode) => {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
      mkdir: (path, mode) => {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
      mkdirTree: (path, mode) => {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += "/" + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
        }
      },
      mkdev: (path, mode, dev) => {
        if (typeof dev == "undefined") {
          dev = mode;
          mode = 438;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
      symlink: (oldpath, newpath) => {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
      rename: (old_path, new_path) => {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(28);
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS.ErrnoError(55);
        }
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (old_node === new_node) {
          return;
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        errCode = new_node
          ? FS.mayDelete(new_dir, new_name, isdir)
          : FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (
          FS.isMountpoint(old_node) ||
          (new_node && FS.isMountpoint(new_node))
        ) {
          throw new FS.ErrnoError(10);
        }
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        FS.hashRemoveNode(old_node);
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          FS.hashAddNode(old_node);
        }
      },
      rmdir: (path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
      readdir: (path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },
      unlink: (path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
      readlink: (path) => {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(
          FS.getPath(link.parent),
          link.node_ops.readlink(link)
        );
      },
      stat: (path, dontFollow) => {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },
      lstat: (path) => {
        return FS.stat(path, true);
      },
      chmod: (path, mode, dontFollow) => {
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now(),
        });
      },
      lchmod: (path, mode) => {
        FS.chmod(path, mode, true);
      },
      fchmod: (fd, mode) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
      },
      chown: (path, uid, gid, dontFollow) => {
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, { timestamp: Date.now() });
      },
      lchown: (path, uid, gid) => {
        FS.chown(path, uid, gid, true);
      },
      fchown: (fd, uid, gid) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
      },
      truncate: (path, len) => {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == "string") {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
      },
      ftruncate: (fd, len) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },
      utime: (path, atime, mtime) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
      },
      open: (path, flags, mode) => {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode == "undefined" ? 438 : mode;
        if (flags & 64) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == "object") {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
            node = lookup.node;
          } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS.ErrnoError(20);
            }
          } else {
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        if (flags & 512 && !created) {
          FS.truncate(node, 0);
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          ungotten: [],
          error: false,
        });
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
      close: (stream) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null;
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
      isClosed: (stream) => {
        return stream.fd === null;
      },
      llseek: (stream, offset, whence) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
      read: (stream, buffer, offset, length, position) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(
          stream,
          buffer,
          offset,
          length,
          position
        );
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
      write: (stream, buffer, offset, length, position, canOwn) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(
          stream,
          buffer,
          offset,
          length,
          position,
          canOwn
        );
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
      allocate: (stream, offset, length) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },
      mmap: (stream, length, position, prot, flags) => {
        if (
          (prot & 2) !== 0 &&
          (flags & 2) === 0 &&
          (stream.flags & 2097155) !== 2
        ) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
      msync: (stream, buffer, offset, length, mmapFlags) => {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(
          stream,
          buffer,
          offset,
          length,
          mmapFlags
        );
      },
      munmap: (stream) => 0,
      ioctl: (stream, cmd, arg) => {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
      readFile: (path, opts = {}) => {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === "binary") {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },
      writeFile: (path, data, opts = {}) => {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == "string") {
          var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error("Unsupported data type");
        }
        FS.close(stream);
      },
      cwd: () => FS.currentPath,
      chdir: (path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
      createDefaultDirectories: () => {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user");
      },
      createDefaultDevices: () => {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device = getRandomDevice();
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories: () => {
        FS.mkdir("/proc");
        var proc_self = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount(
          {
            mount: () => {
              var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
              node.node_ops = {
                lookup: (parent, name) => {
                  var fd = +name;
                  var stream = FS.getStream(fd);
                  if (!stream) throw new FS.ErrnoError(8);
                  var ret = {
                    parent: null,
                    mount: { mountpoint: "fake" },
                    node_ops: { readlink: () => stream.path },
                  };
                  ret.parent = ret;
                  return ret;
                },
              };
              return node;
            },
          },
          {},
          "/proc/self/fd"
        );
      },
      createStandardStreams: () => {
        if (Module["stdin"]) {
          FS.createDevice("/dev", "stdin", Module["stdin"]);
        } else {
          FS.symlink("/dev/tty", "/dev/stdin");
        }
        if (Module["stdout"]) {
          FS.createDevice("/dev", "stdout", null, Module["stdout"]);
        } else {
          FS.symlink("/dev/tty", "/dev/stdout");
        }
        if (Module["stderr"]) {
          FS.createDevice("/dev", "stderr", null, Module["stderr"]);
        } else {
          FS.symlink("/dev/tty1", "/dev/stderr");
        }
        var stdin = FS.open("/dev/stdin", 0);
        var stdout = FS.open("/dev/stdout", 1);
        var stderr = FS.open("/dev/stderr", 1);
      },
      ensureErrnoError: () => {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = function (errno) {
            this.errno = errno;
          };
          this.setErrno(errno);
          this.message = "FS error";
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = "<generic error, no stack>";
        });
      },
      staticInit: () => {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = { MEMFS: MEMFS };
      },
      init: (input, output, error) => {
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams();
      },
      quit: () => {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },
      getMode: (canRead, canWrite) => {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },
      findObject: (path, dontResolveLastLink) => {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          return null;
        }
      },
      analyzePath: (path, dontResolveLastLink) => {
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {}
        var ret = {
          isRoot: false,
          exists: false,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: false,
          parentPath: null,
          parentObject: null,
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === "/";
        } catch (e) {
          ret.error = e.errno;
        }
        return ret;
      },
      createPath: (parent, path, canRead, canWrite) => {
        parent = typeof parent == "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {}
          parent = current;
        }
        return current;
      },
      createFile: (parent, name, properties, canRead, canWrite) => {
        var path = PATH.join2(
          typeof parent == "string" ? parent : FS.getPath(parent),
          name
        );
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
      createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
        var path = name;
        if (parent) {
          parent = typeof parent == "string" ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == "string") {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i)
              arr[i] = data.charCodeAt(i);
            data = arr;
          }
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },
      createDevice: (parent, name, input, output) => {
        var path = PATH.join2(
          typeof parent == "string" ? parent : FS.getPath(parent),
          name
        );
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
          open: (stream) => {
            stream.seekable = false;
          },
          close: (stream) => {
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: (stream, buffer, offset, length, pos) => {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: (stream, buffer, offset, length, pos) => {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          },
        });
        return FS.mkdev(path, mode, dev);
      },
      forceLoadFile: (obj) => {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
          return true;
        if (typeof XMLHttpRequest != "undefined") {
          throw new Error(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
          );
        } else if (read_) {
          try {
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        } else {
          throw new Error("Cannot load without read() or XMLHttpRequest.");
        }
      },
      createLazyFile: (parent, name, url, canRead, canWrite) => {
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = [];
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length - 1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize) | 0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter =
          function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          };
        LazyUint8Array.prototype.cacheLength =
          function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (
              !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
            )
              throw new Error(
                "Couldn't load " + url + ". Status: " + xhr.status
              );
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing =
              (header = xhr.getResponseHeader("Accept-Ranges")) &&
              header === "bytes";
            var usesGzip =
              (header = xhr.getResponseHeader("Content-Encoding")) &&
              header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
              if (from > to)
                throw new Error(
                  "invalid range (" +
                    from +
                    ", " +
                    to +
                    ") or no bytes requested!"
                );
              if (to > datalength - 1)
                throw new Error(
                  "only " + datalength + " bytes available! programmer error!"
                );
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              if (datalength !== chunkSize)
                xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
              xhr.responseType = "arraybuffer";
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
              }
              xhr.send(null);
              if (
                !((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304)
              )
                throw new Error(
                  "Couldn't load " + url + ". Status: " + xhr.status
                );
              if (xhr.response !== undefined) {
                return new Uint8Array(xhr.response || []);
              } else {
                return intArrayFromString(xhr.responseText || "", true);
              }
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == "undefined")
                throw new Error("doXHR failed!");
              return lazyArray.chunks[chunkNum];
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out(
                "LazyFiles on gzip forces download of the whole file when length is accessed"
              );
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          };
        if (typeof XMLHttpRequest != "undefined") {
          if (!ENVIRONMENT_IS_WORKER)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              },
            },
            chunkSize: {
              get: function () {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              },
            },
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        Object.defineProperties(node, {
          usedBytes: {
            get: function () {
              return this.contents.length;
            },
          },
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length) return 0;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position);
        };
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr: ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
      createPreloadedFile: (
        parent,
        name,
        url,
        canRead,
        canWrite,
        onload,
        onerror,
        dontCreateFile,
        canOwn,
        preFinish
      ) => {
        var fullname = name
          ? PATH_FS.resolve(PATH.join2(parent, name))
          : parent;
        var dep = getUniqueRunDependency("cp " + fullname);
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(
                parent,
                name,
                byteArray,
                canRead,
                canWrite,
                canOwn
              );
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          if (
            Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
              if (onerror) onerror();
              removeRunDependency(dep);
            })
          ) {
            return;
          }
          finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == "string") {
          asyncLoad(url, (byteArray) => processData(byteArray), onerror);
        } else {
          processData(url);
        }
      },
      indexedDB: () => {
        return (
          window.indexedDB ||
          window.mozIndexedDB ||
          window.webkitIndexedDB ||
          window.msIndexedDB
        );
      },
      DB_NAME: () => {
        return "EM_FS_" + window.location.pathname;
      },
      DB_VERSION: 20,
      DB_STORE_NAME: "FILE_DATA",
      saveFilesToDB: (paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = () => {
          out("creating db");
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = () => {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0,
            fail = 0,
            total = paths.length;
          function finish() {
            if (fail == 0) onload();
            else onerror();
          }
          paths.forEach((path) => {
            var putRequest = files.put(
              FS.analyzePath(path).object.contents,
              path
            );
            putRequest.onsuccess = () => {
              ok++;
              if (ok + fail == total) finish();
            };
            putRequest.onerror = () => {
              fail++;
              if (ok + fail == total) finish();
            };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },
      loadFilesFromDB: (paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = () => {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
          } catch (e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0,
            fail = 0,
            total = paths.length;
          function finish() {
            if (fail == 0) onload();
            else onerror();
          }
          paths.forEach((path) => {
            var getRequest = files.get(path);
            getRequest.onsuccess = () => {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(
                PATH.dirname(path),
                PATH.basename(path),
                getRequest.result,
                true,
                true,
                true
              );
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = () => {
              fail++;
              if (ok + fail == total) finish();
            };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },
    };
    var SYSCALLS = {
      DEFAULT_POLLMASK: 5,
      calculateAt: function (dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = FS.getStream(dirfd);
          if (!dirstream) throw new FS.ErrnoError(8);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },
      doStat: function (func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (
            e &&
            e.node &&
            PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
          ) {
            return -54;
          }
          throw e;
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[(buf + 4) >> 2] = 0;
        HEAP32[(buf + 8) >> 2] = stat.ino;
        HEAP32[(buf + 12) >> 2] = stat.mode;
        HEAP32[(buf + 16) >> 2] = stat.nlink;
        HEAP32[(buf + 20) >> 2] = stat.uid;
        HEAP32[(buf + 24) >> 2] = stat.gid;
        HEAP32[(buf + 28) >> 2] = stat.rdev;
        HEAP32[(buf + 32) >> 2] = 0;
        (tempI64 = [
          stat.size >>> 0,
          ((tempDouble = stat.size),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 40) >> 2] = tempI64[0]),
          (HEAP32[(buf + 44) >> 2] = tempI64[1]);
        HEAP32[(buf + 48) >> 2] = 4096;
        HEAP32[(buf + 52) >> 2] = stat.blocks;
        HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
        HEAP32[(buf + 60) >> 2] = 0;
        HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
        HEAP32[(buf + 68) >> 2] = 0;
        HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
        HEAP32[(buf + 76) >> 2] = 0;
        (tempI64 = [
          stat.ino >>> 0,
          ((tempDouble = stat.ino),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[(buf + 80) >> 2] = tempI64[0]),
          (HEAP32[(buf + 84) >> 2] = tempI64[1]);
        return 0;
      },
      doMsync: function (addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
        return ret;
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
      getStreamFromFD: function (fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      },
    };
    function ___cxa_allocate_exception(size) {
      return _malloc(size + 24) + 24;
    }
    function ExceptionInfo(excPtr) {
      this.excPtr = excPtr;
      this.ptr = excPtr - 24;
      this.set_type = function (type) {
        HEAPU32[(this.ptr + 4) >> 2] = type;
      };
      this.get_type = function () {
        return HEAPU32[(this.ptr + 4) >> 2];
      };
      this.set_destructor = function (destructor) {
        HEAPU32[(this.ptr + 8) >> 2] = destructor;
      };
      this.get_destructor = function () {
        return HEAPU32[(this.ptr + 8) >> 2];
      };
      this.set_refcount = function (refcount) {
        HEAP32[this.ptr >> 2] = refcount;
      };
      this.set_caught = function (caught) {
        caught = caught ? 1 : 0;
        HEAP8[(this.ptr + 12) >> 0] = caught;
      };
      this.get_caught = function () {
        return HEAP8[(this.ptr + 12) >> 0] != 0;
      };
      this.set_rethrown = function (rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(this.ptr + 13) >> 0] = rethrown;
      };
      this.get_rethrown = function () {
        return HEAP8[(this.ptr + 13) >> 0] != 0;
      };
      this.init = function (type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
        this.set_refcount(0);
        this.set_caught(false);
        this.set_rethrown(false);
      };
      this.add_ref = function () {
        var value = HEAP32[this.ptr >> 2];
        HEAP32[this.ptr >> 2] = value + 1;
      };
      this.release_ref = function () {
        var prev = HEAP32[this.ptr >> 2];
        HEAP32[this.ptr >> 2] = prev - 1;
        return prev === 1;
      };
      this.set_adjusted_ptr = function (adjustedPtr) {
        HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr;
      };
      this.get_adjusted_ptr = function () {
        return HEAPU32[(this.ptr + 16) >> 2];
      };
      this.get_exception_ptr = function () {
        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
          return HEAPU32[this.excPtr >> 2];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr;
      };
    }
    var exceptionLast = 0;
    var uncaughtExceptionCount = 0;
    function ___cxa_throw(ptr, type, destructor) {
      var info = new ExceptionInfo(ptr);
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      throw ptr;
    }
    function ___syscall_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
          case 0: {
            var arg = SYSCALLS.get();
            if (arg < 0) {
              return -28;
            }
            var newStream;
            newStream = FS.createStream(stream, arg);
            return newStream.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return stream.flags;
          case 4: {
            var arg = SYSCALLS.get();
            stream.flags |= arg;
            return 0;
          }
          case 5: {
            var arg = SYSCALLS.get();
            var offset = 0;
            HEAP16[(arg + offset) >> 1] = 2;
            return 0;
          }
          case 6:
          case 7:
            return 0;
          case 16:
          case 8:
            return -28;
          case 9:
            setErrNo(28);
            return -1;
          default: {
            return -28;
          }
        }
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_fstat64(fd, buf) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return SYSCALLS.doStat(FS.stat, stream.path, buf);
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_getcwd(buf, size) {
      try {
        if (size === 0) return -28;
        var cwd = FS.cwd();
        var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
        if (size < cwdLengthInBytes) return -68;
        stringToUTF8(cwd, buf, size);
        return cwdLengthInBytes;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_getdents64(fd, dirp, count) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (!stream.getdents) {
          stream.getdents = FS.readdir(stream.path);
        }
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
        var idx = Math.floor(off / struct_size);
        while (idx < stream.getdents.length && pos + struct_size <= count) {
          var id;
          var type;
          var name = stream.getdents[idx];
          if (name === ".") {
            id = stream.node.id;
            type = 4;
          } else if (name === "..") {
            var lookup = FS.lookupPath(stream.path, { parent: true });
            id = lookup.node.id;
            type = 4;
          } else {
            var child = FS.lookupNode(stream.node, name);
            id = child.id;
            type = FS.isChrdev(child.mode)
              ? 2
              : FS.isDir(child.mode)
              ? 4
              : FS.isLink(child.mode)
              ? 10
              : 8;
          }
          (tempI64 = [
            id >>> 0,
            ((tempDouble = id),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                    0) >>>
                  0
                : ~~+Math.ceil(
                    (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                  ) >>> 0
              : 0),
          ]),
            (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
            (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
          (tempI64 = [
            ((idx + 1) * struct_size) >>> 0,
            ((tempDouble = (idx + 1) * struct_size),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                    0) >>>
                  0
                : ~~+Math.ceil(
                    (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                  ) >>> 0
              : 0),
          ]),
            (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
            (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
          HEAP16[(dirp + pos + 16) >> 1] = 280;
          HEAP8[(dirp + pos + 18) >> 0] = type;
          stringToUTF8(name, dirp + pos + 19, 256);
          pos += struct_size;
          idx += 1;
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
          case 21509:
          case 21505: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21510:
          case 21511:
          case 21512:
          case 21506:
          case 21507:
          case 21508: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21519: {
            if (!stream.tty) return -59;
            var argp = SYSCALLS.get();
            HEAP32[argp >> 2] = 0;
            return 0;
          }
          case 21520: {
            if (!stream.tty) return -59;
            return -28;
          }
          case 21531: {
            var argp = SYSCALLS.get();
            return FS.ioctl(stream, op, argp);
          }
          case 21523: {
            if (!stream.tty) return -59;
            return 0;
          }
          case 21524: {
            if (!stream.tty) return -59;
            return 0;
          }
          default:
            abort("bad ioctl syscall " + op);
        }
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_lstat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.lstat, path, buf);
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_newfstatat(dirfd, path, buf, flags) {
      try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        var allowEmpty = flags & 4096;
        flags = flags & ~4352;
        path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
        return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        var mode = varargs ? SYSCALLS.get() : 0;
        return FS.open(path, flags, mode).fd;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function ___syscall_stat64(path, buf) {
      try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.stat, path, buf);
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function __dlinit(main_dso_handle) {}
    var dlopenMissingError =
      "To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking";
    function __dlopen_js(filename, flag) {
      abort(dlopenMissingError);
    }
    function __dlsym_js(handle, symbol) {
      abort(dlopenMissingError);
    }
    var tupleRegistrations = {};
    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAP32[pointer >> 2]);
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var char_0 = 48;
    var char_9 = 57;
    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown";
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      }
      return name;
    }

    function createNamedFunction(name, humanName, body) {
      name = makeLegalFunctionName(name);
      if (humanName.indexOf("applySettings") === -1) {
        humanName = makeLegalFunctionName(humanName);
      }

      //console.log(name, humanName)
      if (humanName === "constructor$RegistryKeys") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$RegistryKeys() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor RegistryKeys called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$EntityVector") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$EntityVector() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor EntityVector called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$AssetInstanceVector") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$AssetInstanceVector() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor AssetInstanceVector called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$MaterialInstanceVector") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$MaterialInstanceVector() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor MaterialInstanceVector called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$_create") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$_create() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine._create called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getSupportedFeatureLevel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getSupportedFeatureLevel() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getSupportedFeatureLevel called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$setActiveFeatureLevel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$setActiveFeatureLevel(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.setActiveFeatureLevel called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // FeatureLevel
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getActiveFeatureLevel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getActiveFeatureLevel() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getActiveFeatureLevel called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$createSwapChain") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$createSwapChain() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.createSwapChain called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$createRenderer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$createRenderer() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.createRenderer called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$createView") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$createView() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.createView called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$getBlendMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function View$getBlendMode() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function View.getBlendMode called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$getAmbientOcclusion") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function View$getAmbientOcclusion() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function View.getAmbientOcclusion called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$getAntiAliasing") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function View$getAntiAliasing() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function View.getAntiAliasing called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$createScene") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$createScene() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.createScene called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getFrustum") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getFrustum() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getFrustum called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function ColorGrading$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function ColorGrading.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$quality") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$quality(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.quality called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // ColorGrading$QualityLevel
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$format") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$format(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.format called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // ColorGrading$LutFormat
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$toneMapping") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$toneMapping(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.toneMapping called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // ColorGrading$ToneMapping
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$Builder$face") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderTarget$Builder$face(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderTarget$Builder.face called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var arg1Wired = argType1.toWireType(null, arg1); // Texture$CubemapFace
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderTarget$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderTarget$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function RenderTarget$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function RenderTarget.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$getFace") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderTarget$getFace(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderTarget.getFace called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getRenderableManager") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getRenderableManager() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getRenderableManager called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getTransformManager") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getTransformManager() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getTransformManager called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TransformManager$getChildren") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$getChildren(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.getChildren called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransformManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getLightManager") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getLightManager() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getLightManager called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.Builder called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Type
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$getType") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getType(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getType called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "BufferObject$Builder$bindingType") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function BufferObject$Builder$bindingType(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function BufferObject$Builder.bindingType called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // BufferObject$BindingType
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "BufferObject$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function BufferObject$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function BufferObject$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "BufferObject$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function BufferObject$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function BufferObject.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder$normalized") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function VertexBuffer$Builder$normalized(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function VertexBuffer$Builder.normalized called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // VertexAttribute
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function VertexBuffer$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function VertexBuffer$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function VertexBuffer$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function VertexBuffer.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndexBuffer$Builder$bufferType") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndexBuffer$Builder$bufferType(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndexBuffer$Builder.bufferType called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // IndexBuffer$IndexType
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndexBuffer$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndexBuffer$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndexBuffer$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndexBuffer$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function IndexBuffer$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function IndexBuffer.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Material$getDefaultInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Material$getDefaultInstance() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Material.getDefaultInstance called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Material$createInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Material$createInstance() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Material.createInstance called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$getTransparencyMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$getTransparencyMode() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.getTransparencyMode called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$getCullingMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$getCullingMode() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.getCullingMode called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$TextureSampler") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function constructor$TextureSampler(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function constructor TextureSampler called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // MinFilter
            var arg1Wired = argType1.toWireType(null, arg1); // MagFilter
            var arg2Wired = argType2.toWireType(null, arg2); // WrapMode
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$Builder$texture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderTarget$Builder$texture(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderTarget$Builder.texture called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var arg1Wired = argType1.toWireType(null, arg1); // Texture*
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Texture$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Texture.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder$sampler") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$sampler(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.sampler called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture$Sampler
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder$format") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$format(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.format called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture$InternalFormat
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Scene$getIndirectLight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Scene$getIndirectLight() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Scene.getIndirectLight called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$getReflectionsTexture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function IndirectLight$getReflectionsTexture() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function IndirectLight.getReflectionsTexture called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$getIrradianceTexture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function IndirectLight$getIrradianceTexture() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function IndirectLight.getIrradianceTexture called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function IndirectLight$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function IndirectLight.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndirectLight$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder$reflections") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndirectLight$Builder$reflections(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight$Builder.reflections called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture const*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder$irradianceTex") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndirectLight$Builder$irradianceTex(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight$Builder.irradianceTex called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture const*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Scene$getSkybox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Scene$getSkybox() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Scene.getSkybox called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Skybox$getTexture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Skybox$getTexture() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Skybox.getTexture called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Skybox$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Skybox$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Skybox.Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Skybox$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Skybox$Builder$_build(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Skybox$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Skybox$Builder$environment") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Skybox$Builder$environment(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Skybox$Builder.environment called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$createCamera") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$createCamera(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.createCamera called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getCameraComponent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$getCameraComponent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.getCameraComponent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$getInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$getInstance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.getInstance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TransformManager$getInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$getInstance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.getInstance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TransformManager$getParent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$getParent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.getParent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransformManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$getInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getInstance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getInstance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$getEntityManager") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getEntityManager() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getEntityManager called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "EntityManager$get") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function EntityManager$get() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function EntityManager.get called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "EntityManager$create") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function EntityManager$create() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function EntityManager.create called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Engine$_createMaterial") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$_createMaterial(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine._createMaterial called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$Ktx1Bundle") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function constructor$Ktx1Bundle(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function constructor Ktx1Bundle called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$getPixelDataFormat") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$getPixelDataFormat() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.getPixelDataFormat called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$getPixelDataType") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$getPixelDataType() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.getPixelDataType called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$getCompressedPixelDataType") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$getCompressedPixelDataType() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.getCompressedPixelDataType called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx2Reader$requestFormat") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Ktx2Reader$requestFormat(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Ktx2Reader.requestFormat called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture$InternalFormat
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx2Reader$load") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Ktx2Reader$load(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Ktx2Reader.load called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var arg1Wired = argType1.toWireType(null, arg1); // Ktx2Reader$TransferFunction
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$info") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$info() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.info called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$MeshReader$MaterialRegistry") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$MeshReader$MaterialRegistry() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor MeshReader$MaterialRegistry called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$MaterialRegistry$keys") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MeshReader$MaterialRegistry$keys() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MeshReader$MaterialRegistry.keys called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$loadMeshFromBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function MeshReader$loadMeshFromBuffer(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function MeshReader.loadMeshFromBuffer called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // driver$BufferDescriptor
            var arg2Wired = argType2.toWireType(null, arg2); // MeshReader$MaterialRegistry
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$Mesh$renderable") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MeshReader$Mesh$renderable() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MeshReader$Mesh.renderable called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$Mesh$vertexBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MeshReader$Mesh$vertexBuffer() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MeshReader$Mesh.vertexBuffer called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$Mesh$indexBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MeshReader$Mesh$indexBuffer() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MeshReader$Mesh.indexBuffer called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$SurfaceOrientation$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$SurfaceOrientation$Builder() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor SurfaceOrientation$Builder called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function SurfaceOrientation$Builder$_build() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function SurfaceOrientation$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$gltfio$FileLoader") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$gltfio$FileLoader() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor gltfio$FileLoader called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$_getEntities() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getEntities called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getLightEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$_getLightEntities() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getLightEntities called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getRenderableEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$_getRenderableEntities() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getRenderableEntities called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getCameraEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$_getCameraEntities() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getCameraEntities called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getRoot") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$getRoot() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getRoot called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$popRenderable") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$popRenderable() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.popRenderable called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getAssetInstances") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$_getAssetInstances() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getAssetInstances called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getResourceUris") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$_getResourceUris() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getResourceUris called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getWireframe") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$getWireframe() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getWireframe called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getEngine") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$getEngine() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getEngine called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$getInstance() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getInstance called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getAsset") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getAsset() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getAsset called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getEntities() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getEntities called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getRoot") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getRoot() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getRoot called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getAnimator") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getAnimator() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getAnimator called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getAvatar") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getAvatar() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getAvatar called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getFileLoader") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getFileLoader() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getFileLoader called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getSkinNames") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getSkinNames() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getSkinNames called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$getMaterialInstances") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$getMaterialInstances() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance.getMaterialInstances called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (
        humanName === "gltfio$CTEngineInstance$_getMaterialVariantNames"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineInstance$_getMaterialVariantNames() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineInstance._getMaterialVariantNames called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$gltfio$UbershaderProvider") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function constructor$gltfio$UbershaderProvider(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function constructor gltfio$UbershaderProvider called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$gltfio$StbProvider") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function constructor$gltfio$StbProvider(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function constructor gltfio$StbProvider called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$gltfio$Ktx2Provider") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function constructor$gltfio$Ktx2Provider(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function constructor gltfio$Ktx2Provider called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$gltfio$AssetLoader") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function constructor$gltfio$AssetLoader(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function constructor gltfio$AssetLoader called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$UbershaderProvider
            var rv = invoker(fn, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$AssetLoader$_createAsset") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$AssetLoader$_createAsset(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$AssetLoader._createAsset called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$AssetLoader$createInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$AssetLoader$createInstance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$AssetLoader.createInstance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // gltfio$CTEngineAsset*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$CTScene") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3
        ) {
          return function constructor$CTScene(arg0, arg1, arg2, arg3) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function constructor CTScene called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // View*
            var arg2Wired = argType2.toWireType(null, arg2); // Scene*
            var arg3Wired = argType3.toWireType(null, arg3); // Material*
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired, arg3Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$GetEngine") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function CTScene$GetEngine() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function CTScene.GetEngine called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$JsonSerializer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function constructor$JsonSerializer() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function constructor JsonSerializer called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var rv = invoker(fn);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ViewerGui$getSettings") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function ViewerGui$getSettings() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function ViewerGui.getSettings called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "EntityVector$push_back") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function EntityVector$push_back(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function EntityVector.push_back called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "AssetInstanceVector$push_back") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function AssetInstanceVector$push_back(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function AssetInstanceVector.push_back called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // gltfio$CTEngineInstance*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstanceVector$push_back") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstanceVector$push_back(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstanceVector.push_back called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // MaterialInstance const*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$enableAccurateTranslations") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$enableAccurateTranslations() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.enableAccurateTranslations called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "Engine$_execute") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$_execute() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine._execute called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "Engine$destroy") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroy(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroy called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            invoker(fn, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroySwapChain") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroySwapChain(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroySwapChain called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // SwapChain*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyRenderer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyRenderer(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyRenderer called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Renderer*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyView") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyView(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyView called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyScene") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyScene(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyScene called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Scene*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyCameraComponent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyCameraComponent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyCameraComponent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyMaterial") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyMaterial(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyMaterial called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Material*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyEntity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyEntity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyEntity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyColorGrading") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyColorGrading(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyColorGrading called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // ColorGrading*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyIndexBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyIndexBuffer(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyIndexBuffer called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // IndexBuffer*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyIndirectLight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyIndirectLight(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyIndirectLight called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // IndirectLight*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyMaterialInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyMaterialInstance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyMaterialInstance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // MaterialInstance*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyRenderTarget") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyRenderTarget(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyRenderTarget called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroySkybox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroySkybox(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroySkybox called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Skybox*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyTexture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyTexture(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyTexture called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$destroyVertexBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$destroyVertexBuffer(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.destroyVertexBuffer called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // VertexBuffer*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Renderer$renderView") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Renderer$renderView(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Renderer.renderView called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View const*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Renderer$renderStandaloneView") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Renderer$renderStandaloneView(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Renderer.renderStandaloneView called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View const*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Renderer$render") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Renderer$render(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Renderer.render called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // SwapChain*
            var arg1Wired = argType1.toWireType(null, arg1); // View*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "Renderer$endFrame") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Renderer$endFrame() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Renderer.endFrame called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "View$setScene") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setScene(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setScene called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Scene*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setCamera") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setCamera(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setCamera called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Camera*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setColorGrading") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setColorGrading(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setColorGrading called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // ColorGrading*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setBlendMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setBlendMode(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setBlendMode called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$BlendMode
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setAmbientOcclusion") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setAmbientOcclusion(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setAmbientOcclusion called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$AmbientOcclusion
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setAntiAliasing") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setAntiAliasing(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setAntiAliasing called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$AntiAliasing
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setRenderTarget") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setRenderTarget(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setRenderTarget called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Scene$addEntity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$addEntity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene.addEntity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Scene$_addEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$_addEntities(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene._addEntities called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // EntityVector
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Scene$_removeEntities") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$_removeEntities(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene._removeEntities called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // EntityVector
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Scene$remove") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$remove(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene.remove called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Scene$setSkybox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$setSkybox(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene.setSkybox called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Skybox*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Scene$setIndirectLight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$setIndirectLight(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene.setIndirectLight called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // IndirectLight*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "RenderableManager$destroy") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$destroy(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.destroy called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "TransformManager$create") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$create(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.create called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "TransformManager$destroy") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$destroy(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.destroy called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "TransformManager$setParent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function TransformManager$setParent(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function TransformManager.setParent called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransformManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // TransformManager$Instance
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (
        humanName === "TransformManager$openLocalTransformTransaction"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function TransformManager$openLocalTransformTransaction() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function TransformManager.openLocalTransformTransaction called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (
        humanName === "TransformManager$commitLocalTransformTransaction"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function TransformManager$commitLocalTransformTransaction() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function TransformManager.commitLocalTransformTransaction called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "MaterialInstance$setTransparencyMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setTransparencyMode(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setTransparencyMode called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransparencyMode
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setCullingMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setCullingMode(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setCullingMode called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // CullingMode
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilCompareFunction") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilCompareFunction(
            arg0,
            arg1
          ) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilCompareFunction called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // CompareFunc
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilCompareFunction") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilCompareFunction(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilCompareFunction called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // CompareFunc
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilOpStencilFail") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilOpStencilFail(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilOpStencilFail called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // StencilOperation
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilOpStencilFail") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilOpStencilFail(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilOpStencilFail called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // StencilOperation
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilOpDepthFail") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilOpDepthFail(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilOpDepthFail called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // StencilOperation
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilOpDepthFail") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilOpDepthFail(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilOpDepthFail called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // StencilOperation
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (
        humanName === "MaterialInstance$setStencilOpDepthStencilPass"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilOpDepthStencilPass(
            arg0,
            arg1
          ) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilOpDepthStencilPass called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // StencilOperation
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (
        humanName === "MaterialInstance$setStencilOpDepthStencilPass"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilOpDepthStencilPass(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilOpDepthStencilPass called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // StencilOperation
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "TextureSampler$setCompareMode") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function TextureSampler$setCompareMode(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function TextureSampler.setCompareMode called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // CompareMode
            var arg1Wired = argType1.toWireType(null, arg1); // CompareFunc
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "Texture$generateMipmaps") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$generateMipmaps(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture.generateMipmaps called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "EntityManager$destroy") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function EntityManager$destroy(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function EntityManager.destroy called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Ktx2Reader$unrequestFormat") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Ktx2Reader$unrequestFormat(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Ktx2Reader.unrequestFormat called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Texture$InternalFormat
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "gltfio$Animator$updateBoneMatrices") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$Animator$updateBoneMatrices() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$Animator.updateBoneMatrices called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "gltfio$Animator$resetBoneMatrices") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$Animator$resetBoneMatrices() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$Animator.resetBoneMatrices called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "gltfio$FileLoader$test") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$FileLoader$test(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$FileLoader.test called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$CTEngineAsset*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "gltfio$FileLoader$applyAnimation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$FileLoader$applyAnimation(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$FileLoader.applyAnimation called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$CTEngineAsset*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$releaseSourceData") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$releaseSourceData() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.releaseSourceData called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$createAvatar") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$CTEngineInstance$createAvatar(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$CTEngineInstance.createAvatar called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$CTEngineAsset*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "gltfio$UbershaderProvider$destroyMaterials") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$UbershaderProvider$destroyMaterials() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$UbershaderProvider.destroyMaterials called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "gltfio$AssetLoader$destroyAsset") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$AssetLoader$destroyAsset(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$AssetLoader.destroyAsset called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // gltfio$CTEngineAsset const*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$asyncUpdateLoad") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$ResourceLoader$asyncUpdateLoad() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$ResourceLoader.asyncUpdateLoad called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "CTAnimator$updateBoneMatrices") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function CTAnimator$updateBoneMatrices(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTAnimator.updateBoneMatrices called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // CTScene
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "CTScene$init") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function CTScene$init() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function CTScene.init called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "CTScene$Render") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function CTScene$Render() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function CTScene.Render called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "CTScene$CreatePlane") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function CTScene$CreatePlane() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function CTScene.CreatePlane called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "CTScene$SetCamera") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function CTScene$SetCamera(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.SetCamera called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Camera const*
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "CTScene$addBackground") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function CTScene$addBackground() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function CTScene.addBackground called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            invoker(fn, thisWired);
          };
        };
      } else if (humanName === "applyColorGrading") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function applyColorGrading(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function applyColorGrading called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // ViewerGui*
            var arg2Wired = argType2.toWireType(null, arg2); // View*
            invoker(fn, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "CTScene$createBackground(arg0)") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function CTScene$createBackground(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.createBackground called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Material*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$createBackground") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function CTScene$createBackground(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.createBackground called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Material*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$showBackground") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function CTScene$showBackground(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.showBackground called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float3
          };
        };
      } else if (humanName === "gltfio$Avatar$setVoice") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function gltfio$Avatar$setVoice(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$Avatar.setVoice called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$setTexture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function CTScene$setTexture(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.setTexture called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "applySettings(arg0, arg1, arg2, arg3, arg4)") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4
        ) {
          return function applySettings(arg0, arg1, arg2, arg3, arg4) {
            if (arguments.length !== 5) {
              throwBindingError(
                "function applySettings called with " +
                  arguments.length +
                  " arguments, expected 5 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // ViewerGui*
            var arg2Wired = argType2.toWireType(null, arg2); // Camera*
            var arg3Wired = argType3.toWireType(null, arg3); // Skybox*
            var arg4Wired = argType4.toWireType(null, arg4); // Renderer*
            invoker(fn, arg0Wired, arg1Wired, arg2Wired, arg3Wired, arg4Wired);
          };
        };
      } else if (humanName === "applySettings(arg0, arg1, arg2)") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function applySettings(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function applySettings called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // ViewerGui*
            var arg2Wired = argType2.toWireType(null, arg2); // View*
            invoker(fn, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (
        humanName === "applySettings(arg0, arg1, arg2, arg3, arg4, arg5, arg6)"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4,
          argType5,
          argType6
        ) {
          return function applySettings(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5,
            arg6
          ) {
            if (arguments.length !== 7) {
              throwBindingError(
                "function applySettings called with " +
                  arguments.length +
                  " arguments, expected 7 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // ViewerGui*
            var arg2Wired = argType2.toWireType(null, arg2); // IndirectLight*
            var arg3Wired = argType3.toWireType(null, arg3); // Entity
            var arg4Wired = argType4.toWireType(null, arg4); // LightManager*
            var arg5Wired = argType5.toWireType(null, arg5); // Scene*
            var arg6Wired = argType6.toWireType(null, arg6); // View*
            invoker(
              fn,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired,
              arg5Wired,
              arg6Wired
            );
          };
        };
      } else if (humanName === "Engine$setAutomaticInstancingEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Engine$setAutomaticInstancingEnabled(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Engine.setAutomaticInstancingEnabled called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Engine$isAutomaticInstancingEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$isAutomaticInstancingEnabled() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.isAutomaticInstancingEnabled called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SwapChain$isSRGBSwapChainSupported") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function SwapChain$isSRGBSwapChainSupported(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function SwapChain.isSRGBSwapChainSupported called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Renderer$beginFrame") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Renderer$beginFrame(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Renderer.beginFrame called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // SwapChain*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$setPostProcessingEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setPostProcessingEnabled(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setPostProcessingEnabled called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setStencilBufferEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setStencilBufferEnabled(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setStencilBufferEnabled called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$isStencilBufferEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function View$isStencilBufferEnabled() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function View.isStencilBufferEnabled called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Scene$hasEntity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Scene$hasEntity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Scene.hasEntity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$luminanceScaling") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$luminanceScaling(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.luminanceScaling called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$gamutMapping") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$gamutMapping(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.gamutMapping called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$culling") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$culling(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.culling called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$castShadows") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$castShadows(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.castShadows called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$receiveShadows") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$receiveShadows(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.receiveShadows called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$morphing") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$morphing(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.morphing called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$hasComponent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$hasComponent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.hasComponent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setCastShadows") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$setCastShadows(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.setCastShadows called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "RenderableManager$setReceiveShadows") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$setReceiveShadows(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.setReceiveShadows called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "RenderableManager$isShadowCaster") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$isShadowCaster(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.isShadowCaster called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$isShadowReceiver") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$isShadowReceiver(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.isShadowReceiver called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TransformManager$hasComponent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$hasComponent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.hasComponent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$castShadows") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$castShadows(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.castShadows called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$castLight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$castLight(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.castLight called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$hasComponent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$hasComponent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.hasComponent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$isDirectional") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$isDirectional(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.isDirectional called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$isPointLight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$isPointLight(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.isPointLight called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$isSpotLight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$isSpotLight(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.isSpotLight called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setShadowCaster") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$setShadowCaster(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setShadowCaster called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "LightManager$isShadowCaster") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$isShadowCaster(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.isShadowCaster called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder$enableBufferObjects") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function VertexBuffer$Builder$enableBufferObjects(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function VertexBuffer$Builder.enableBufferObjects called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder$normalizedIf") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function VertexBuffer$Builder$normalizedIf(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function VertexBuffer$Builder.normalizedIf called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // VertexAttribute
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$setDoubleSided") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setDoubleSided(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setDoubleSided called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$isDoubleSided") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$isDoubleSided() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.isDoubleSided called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$setColorWrite") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setColorWrite(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setColorWrite called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$isColorWriteEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$isColorWriteEnabled() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.isColorWriteEnabled called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$setDepthWrite") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setDepthWrite(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setDepthWrite called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$isDepthWriteEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$isDepthWriteEnabled() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.isDepthWriteEnabled called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$setStencilWrite") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilWrite(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilWrite called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setDepthCulling") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setDepthCulling(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setDepthCulling called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$isDepthCullingEnabled") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$isDepthCullingEnabled() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.isDepthCullingEnabled called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Skybox$Builder$showSun") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Skybox$Builder$showSun(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Skybox$Builder.showSun called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$getInternalFormat") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Ktx1Bundle$getInternalFormat(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Ktx1Bundle.getInternalFormat called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$isCompressed") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$isCompressed() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.isCompressed called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$isCubemap") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$isCubemap() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.isCubemap called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ktx1reader$createTexture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function ktx1reader$createTexture(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function ktx1reader$createTexture called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // Ktx1Bundle
            var arg2Wired = argType2.toWireType(null, arg2); // bool
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$Ktx2Reader") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function constructor$Ktx2Reader(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function constructor Ktx2Reader called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            var rv = invoker(fn, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$Avatar$SetIsLoop") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$Avatar$SetIsLoop(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$Avatar.SetIsLoop called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // bool
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "constructor$gltfio$ResourceLoader") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function constructor$gltfio$ResourceLoader(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function constructor gltfio$ResourceLoader called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            var rv = invoker(fn, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$loadResources") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$ResourceLoader$loadResources(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$ResourceLoader.loadResources called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // gltfio$CTEngineAsset*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$asyncBeginLoad") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$ResourceLoader$asyncBeginLoad(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$ResourceLoader.asyncBeginLoad called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // gltfio$CTEngineAsset*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$_setGuardBandOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setGuardBandOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setGuardBandOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$GuardBandOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$GuardBandOptions
          };
        };
      } else if (humanName === "View$setVisibleLayers") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function View$setVisibleLayers(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function View.setVisibleLayers called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "View$setSampleCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function View$setSampleCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setSampleCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$getSampleCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function View$getSampleCount() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function View.getSampleCount called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$dimensions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$dimensions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.dimensions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$Builder$mipLevel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderTarget$Builder$mipLevel(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderTarget$Builder.mipLevel called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$getMipLevel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderTarget$getMipLevel(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderTarget.getMipLevel called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$layerMask") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$Builder$layerMask(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager$Builder.layerMask called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$priority") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$priority(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.priority called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$channel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$channel(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.channel called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setLayerMask") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setLayerMask(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setLayerMask called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var arg2Wired = argType2.toWireType(null, arg2); // unsigned char
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$setPriority") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$setPriority(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.setPriority called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "RenderableManager$setChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$setChannel(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.setChannel called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "VertexBuffer$setBufferObjectAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function VertexBuffer$setBufferObjectAt(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function VertexBuffer.setBufferObjectAt called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var arg2Wired = argType2.toWireType(null, arg2); // BufferObject const*
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilReferenceValue") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilReferenceValue(
            arg0,
            arg1
          ) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilReferenceValue called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilReferenceValue") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilReferenceValue(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilReferenceValue called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilReadMask") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilReadMask(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilReadMask called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilReadMask") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilReadMask(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilReadMask called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilWriteMask") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setStencilWriteMask(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setStencilWriteMask called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var arg1Wired = argType1.toWireType(null, arg1); // StencilFace
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setStencilWriteMask") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setStencilWriteMask(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setStencilWriteMask called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Texture$_setImage") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function Texture$_setImage(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function Texture._setImage called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var arg2Wired = argType2.toWireType(null, arg2); // driver$PixelBufferDescriptor
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "Texture$_setImageCube") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function Texture$_setImageCube(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function Texture._setImageCube called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var arg2Wired = argType2.toWireType(null, arg2); // driver$PixelBufferDescriptor
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "Texture$Builder$levels") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$levels(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.levels called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder$usage") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$usage(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.usage called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$_setMultiSampleAntiAliasingOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setMultiSampleAntiAliasingOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setMultiSampleAntiAliasingOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$MultiSampleAntiAliasingOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$MultiSampleAntiAliasingOptions
          };
        };
      } else if (humanName === "RenderableManager$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$Builder$_build(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // Entity
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.Builder called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // int
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$_build") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$Builder$_build(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager$Builder._build called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // Entity
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "BufferObject$Builder$size") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function BufferObject$Builder$size(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function BufferObject$Builder.size called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder$vertexCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function VertexBuffer$Builder$vertexCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function VertexBuffer$Builder.vertexCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$Builder$bufferCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function VertexBuffer$Builder$bufferCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function VertexBuffer$Builder.bufferCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndexBuffer$Builder$indexCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndexBuffer$Builder$indexCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndexBuffer$Builder.indexCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "decodeImage") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function decodeImage(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function decodeImage called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var arg1Wired = argType1.toWireType(null, arg1); // int
            var rv = invoker(fn, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$AssetLoader$_createInstancedAsset") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$AssetLoader$_createInstancedAsset(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$AssetLoader._createInstancedAsset called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var arg1Wired = argType1.toWireType(null, arg1); // int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$ViewerGui") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3
        ) {
          return function constructor$ViewerGui(arg0, arg1, arg2, arg3) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function constructor ViewerGui called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // Scene*
            var arg2Wired = argType2.toWireType(null, arg2); // View*
            var arg3Wired = argType3.toWireType(null, arg3); // int
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired, arg3Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ViewerGui$keyDownEvent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ViewerGui$keyDownEvent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ViewerGui.keyDownEvent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "ViewerGui$keyUpEvent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ViewerGui$keyUpEvent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ViewerGui.keyUpEvent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "ViewerGui$keyPressEvent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ViewerGui$keyPressEvent(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ViewerGui.keyPressEvent called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // int
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "View$setViewport") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$setViewport(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View.setViewport called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Viewport
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // Viewport
          };
        };
      } else if (humanName === "View$getViewport") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function View$getViewport() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function View.getViewport called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$_getBlob") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Ktx1Bundle$_getBlob(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Ktx1Bundle._getBlob called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // KtxBlobIndex
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // KtxBlobIndex
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$Builder$layer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderTarget$Builder$layer(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderTarget$Builder.layer called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderTarget$getLayer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderTarget$getLayer(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderTarget.getLayer called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderTarget$AttachmentPoint
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$lightChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$Builder$lightChannel(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager$Builder.lightChannel called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setLightChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setLightChannel(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setLightChannel called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned int
            var arg2Wired = argType2.toWireType(null, arg2); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$getLightChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$getLightChannel(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.getLightChannel called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$lightChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$Builder$lightChannel(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager$Builder.lightChannel called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setLightChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function LightManager$setLightChannel(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function LightManager.setLightChannel called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned int
            var arg2Wired = argType2.toWireType(null, arg2); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "LightManager$getLightChannel") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$getLightChannel(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.getLightChannel called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "BufferObject$_setBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function BufferObject$_setBuffer(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function BufferObject._setBuffer called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // driver$BufferDescriptor
            var arg2Wired = argType2.toWireType(null, arg2); // unsigned int
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "VertexBuffer$Builder$attribute") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4
        ) {
          return function VertexBuffer$Builder$attribute(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4
          ) {
            if (arguments.length !== 5) {
              throwBindingError(
                "function VertexBuffer$Builder.attribute called with " +
                  arguments.length +
                  " arguments, expected 5 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // VertexAttribute
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var arg2Wired = argType2.toWireType(null, arg2); // VertexBuffer$AttributeType
            var arg3Wired = argType3.toWireType(null, arg3); // unsigned int
            var arg4Wired = argType4.toWireType(null, arg4); // unsigned char
            var rv = invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired
            );
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "VertexBuffer$_setBufferAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3
        ) {
          return function VertexBuffer$_setBufferAt(arg0, arg1, arg2, arg3) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function VertexBuffer._setBufferAt called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var arg2Wired = argType2.toWireType(null, arg2); // driver$BufferDescriptor
            var arg3Wired = argType3.toWireType(null, arg3); // unsigned int
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired, arg3Wired);
          };
        };
      } else if (humanName === "IndexBuffer$_setBuffer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function IndexBuffer$_setBuffer(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function IndexBuffer._setBuffer called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // driver$BufferDescriptor
            var arg2Wired = argType2.toWireType(null, arg2); // unsigned int
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "Texture$Builder$width") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$width(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.width called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder$height") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$height(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.height called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$Builder$depth") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$Builder$depth(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture$Builder.depth called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Entity$getId") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Entity$getId() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Entity.getId called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$driver$BufferDescriptor") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function constructor$driver$BufferDescriptor(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function constructor driver$BufferDescriptor called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$driver$PixelBufferDescriptor") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function constructor$driver$PixelBufferDescriptor(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function constructor driver$PixelBufferDescriptor called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var arg1Wired = argType1.toWireType(null, arg1); // PixelDataFormat
            var arg2Wired = argType2.toWireType(null, arg2); // PixelDataType
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "constructor$driver$PixelBufferDescriptor") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3
        ) {
          return function constructor$driver$PixelBufferDescriptor(
            arg0,
            arg1,
            arg2,
            arg3
          ) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function constructor driver$PixelBufferDescriptor called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var arg1Wired = argType1.toWireType(null, arg1); // CompressedPixelDataType
            var arg2Wired = argType2.toWireType(null, arg2); // int
            var arg3Wired = argType3.toWireType(null, arg3); // bool
            var rv = invoker(fn, arg0Wired, arg1Wired, arg2Wired, arg3Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$getNumMipLevels") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$getNumMipLevels() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.getNumMipLevels called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$getArrayLength") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Ktx1Bundle$getArrayLength() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Ktx1Bundle.getArrayLength called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Ktx1Bundle$_getCubeBlob") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Ktx1Bundle$_getCubeBlob(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Ktx1Bundle._getCubeBlob called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_normals") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function SurfaceOrientation$Builder$_normals(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function SurfaceOrientation$Builder._normals called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var arg1Wired = argType1.toWireType(null, arg1); // int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_tangents") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function SurfaceOrientation$Builder$_tangents(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function SurfaceOrientation$Builder._tangents called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var arg1Wired = argType1.toWireType(null, arg1); // int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_uvs") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function SurfaceOrientation$Builder$_uvs(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function SurfaceOrientation$Builder._uvs called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var arg1Wired = argType1.toWireType(null, arg1); // int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_positions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function SurfaceOrientation$Builder$_positions(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function SurfaceOrientation$Builder._positions called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var arg1Wired = argType1.toWireType(null, arg1); // int
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_triangles16") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function SurfaceOrientation$Builder$_triangles16(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function SurfaceOrientation$Builder._triangles16 called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$_triangles32") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function SurfaceOrientation$Builder$_triangles32(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function SurfaceOrientation$Builder._triangles32 called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RegistryKeys$size") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function RegistryKeys$size() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function RegistryKeys.size called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "EntityVector$resize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function EntityVector$resize(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function EntityVector.resize called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // Entity
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "EntityVector$size") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function EntityVector$size() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function EntityVector.size called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "EntityVector$set") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function EntityVector$set(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function EntityVector.set called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // Entity
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "AssetInstanceVector$resize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function AssetInstanceVector$resize(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function AssetInstanceVector.resize called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$CTEngineInstance*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "AssetInstanceVector$size") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function AssetInstanceVector$size() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function AssetInstanceVector.size called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "AssetInstanceVector$set") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function AssetInstanceVector$set(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function AssetInstanceVector.set called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$CTEngineInstance*
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstanceVector$resize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstanceVector$resize(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstanceVector.resize called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // MaterialInstance const*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstanceVector$size") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstanceVector$size() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstanceVector.size called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstanceVector$set") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstanceVector$set(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstanceVector.set called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // MaterialInstance const*
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Scene$getRenderableCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Scene$getRenderableCount() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Scene.getRenderableCount called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Scene$getLightCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Scene$getLightCount() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Scene.getLightCount called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$geometry") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3
        ) {
          return function RenderableManager$Builder$geometry(
            arg0,
            arg1,
            arg2,
            arg3
          ) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function RenderableManager$Builder.geometry called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // RenderableManager$PrimitiveType
            var arg2Wired = argType2.toWireType(null, arg2); // VertexBuffer*
            var arg3Wired = argType3.toWireType(null, arg3); // IndexBuffer*
            var rv = invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired
            );
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$geometryOffset") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4,
          argType5
        ) {
          return function RenderableManager$Builder$geometryOffset(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5
          ) {
            if (arguments.length !== 6) {
              throwBindingError(
                "function RenderableManager$Builder.geometryOffset called with " +
                  arguments.length +
                  " arguments, expected 6 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // RenderableManager$PrimitiveType
            var arg2Wired = argType2.toWireType(null, arg2); // VertexBuffer*
            var arg3Wired = argType3.toWireType(null, arg3); // IndexBuffer*
            var arg4Wired = argType4.toWireType(null, arg4); // unsigned long
            var arg5Wired = argType5.toWireType(null, arg5); // unsigned long
            var rv = invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired,
              arg5Wired
            );
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$geometryMinMax") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4,
          argType5,
          argType6,
          argType7
        ) {
          return function RenderableManager$Builder$geometryMinMax(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5,
            arg6,
            arg7
          ) {
            if (arguments.length !== 8) {
              throwBindingError(
                "function RenderableManager$Builder.geometryMinMax called with " +
                  arguments.length +
                  " arguments, expected 8 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // RenderableManager$PrimitiveType
            var arg2Wired = argType2.toWireType(null, arg2); // VertexBuffer*
            var arg3Wired = argType3.toWireType(null, arg3); // IndexBuffer*
            var arg4Wired = argType4.toWireType(null, arg4); // unsigned long
            var arg5Wired = argType5.toWireType(null, arg5); // unsigned long
            var arg6Wired = argType6.toWireType(null, arg6); // unsigned long
            var arg7Wired = argType7.toWireType(null, arg7); // unsigned long
            var rv = invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired,
              arg5Wired,
              arg6Wired,
              arg7Wired
            );
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$material") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$Builder$material(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager$Builder.material called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // MaterialInstance*
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$skinning") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$skinning(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.skinning called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$blendOrder") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$Builder$blendOrder(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager$Builder.blendOrder called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned short
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (
        humanName === "RenderableManager$Builder$globalBlendOrderEnabled"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$Builder$globalBlendOrderEnabled(
            arg0,
            arg1
          ) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager$Builder.globalBlendOrderEnabled called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$getPrimitiveCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$getPrimitiveCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.getPrimitiveCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setMaterialInstanceAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setMaterialInstanceAt(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setMaterialInstanceAt called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var arg2Wired = argType2.toWireType(null, arg2); // MaterialInstance const*
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$getMaterialInstanceAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$getMaterialInstanceAt(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.getMaterialInstanceAt called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setGeometryAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4,
          argType5,
          argType6
        ) {
          return function RenderableManager$setGeometryAt(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5,
            arg6
          ) {
            if (arguments.length !== 7) {
              throwBindingError(
                "function RenderableManager.setGeometryAt called with " +
                  arguments.length +
                  " arguments, expected 7 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var arg2Wired = argType2.toWireType(null, arg2); // RenderableManager$PrimitiveType
            var arg3Wired = argType3.toWireType(null, arg3); // VertexBuffer*
            var arg4Wired = argType4.toWireType(null, arg4); // IndexBuffer*
            var arg5Wired = argType5.toWireType(null, arg5); // unsigned long
            var arg6Wired = argType6.toWireType(null, arg6); // unsigned long
            invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired,
              arg5Wired,
              arg6Wired
            );
          };
        };
      } else if (humanName === "RenderableManager$setBlendOrderAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setBlendOrderAt(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setBlendOrderAt called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var arg2Wired = argType2.toWireType(null, arg2); // unsigned short
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (
        humanName === "RenderableManager$setGlobalBlendOrderEnabledAt"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setGlobalBlendOrderEnabledAt(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setGlobalBlendOrderEnabledAt called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var arg2Wired = argType2.toWireType(null, arg2); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$getEnabledAttributesAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$getEnabledAttributesAt(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.getEnabledAttributesAt called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "BufferObject$getByteCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function BufferObject$getByteCount() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function BufferObject.getByteCount called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$_getWidth") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Texture$_getWidth(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Texture._getWidth called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$_getHeight") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Texture$_getHeight(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Texture._getHeight called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$_getDepth") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Texture$_getDepth(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Texture._getDepth called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned char
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Texture$_getLevels") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Texture$_getLevels(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Texture._getLevels called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Engine*
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$MaterialRegistry$size") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MeshReader$MaterialRegistry$size() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MeshReader$MaterialRegistry.size called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$vertexCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function SurfaceOrientation$Builder$vertexCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function SurfaceOrientation$Builder.vertexCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$Builder$triangleCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function SurfaceOrientation$Builder$triangleCount(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function SurfaceOrientation$Builder.triangleCount called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "SurfaceOrientation$_getQuats") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function SurfaceOrientation$_getQuats(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function SurfaceOrientation._getQuats called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // long
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned long
            var arg2Wired = argType2.toWireType(null, arg2); // VertexBuffer$AttributeType
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "gltfio$Animator$getAnimationCount") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$Animator$getAnimationCount() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$Animator.getAnimationCount called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$attachSkin") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$CTEngineInstance$attachSkin(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$CTEngineInstance.attachSkin called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // Entity
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$detachSkin") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$CTEngineInstance$detachSkin(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$CTEngineInstance.detachSkin called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // Entity
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "gltfio$CTEngineInstance$applyMaterialVariant") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$CTEngineInstance$applyMaterialVariant(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$CTEngineInstance.applyMaterialVariant called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Frustum$intersectsBox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Frustum$intersectsBox(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Frustum.intersectsBox called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Box
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // Box
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$boundingBox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function RenderableManager$Builder$boundingBox(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.boundingBox called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Box
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // Box
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setAxisAlignedBoundingBox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function RenderableManager$setAxisAlignedBoundingBox(
            arg0,
            arg1
          ) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.setAxisAlignedBoundingBox called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // Box
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // Box
          };
        };
      } else if (humanName === "RenderableManager$getAxisAlignedBoundingBox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$getAxisAlignedBoundingBox(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager.getAxisAlignedBoundingBox called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getBoundingBox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$CTEngineAsset$getBoundingBox() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getBoundingBox called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$lookAt") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg1Wired_dtor,
          arg2Wired_dtor
        ) {
          return function Camera$lookAt(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function Camera.lookAt called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            var arg2Wired = argType2.toWireType(null, arg2); // float3
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // float3
            arg1Wired_dtor(arg1Wired); // float3
            arg2Wired_dtor(arg2Wired); // float3
          };
        };
      } else if (humanName === "Camera$getLeftVector") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getLeftVector() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getLeftVector called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getUpVector") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getUpVector() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getUpVector called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getForwardVector") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getForwardVector() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getForwardVector called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$channelMixer") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg1Wired_dtor,
          arg2Wired_dtor
        ) {
          return function ColorGrading$Builder$channelMixer(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function ColorGrading$Builder.channelMixer called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            var arg2Wired = argType2.toWireType(null, arg2); // float3
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // float3
            arg1Wired_dtor(arg1Wired); // float3
            arg2Wired_dtor(arg2Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$slopeOffsetPower") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg1Wired_dtor,
          arg2Wired_dtor
        ) {
          return function ColorGrading$Builder$slopeOffsetPower(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function ColorGrading$Builder.slopeOffsetPower called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            var arg2Wired = argType2.toWireType(null, arg2); // float3
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // float3
            arg1Wired_dtor(arg1Wired); // float3
            arg2Wired_dtor(arg2Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$curves") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg1Wired_dtor,
          arg2Wired_dtor
        ) {
          return function ColorGrading$Builder$curves(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function ColorGrading$Builder.curves called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            var arg2Wired = argType2.toWireType(null, arg2); // float3
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // float3
            arg1Wired_dtor(arg1Wired); // float3
            arg2Wired_dtor(arg2Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$position") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function LightManager$Builder$position(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.position called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$direction") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function LightManager$Builder$direction(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.direction called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$color") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function LightManager$Builder$color(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.color called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float3
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setPosition") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function LightManager$setPosition(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setPosition called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // float3
          };
        };
      } else if (humanName === "LightManager$getPosition") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getPosition(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getPosition called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setDirection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function LightManager$setDirection(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setDirection called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // float3
          };
        };
      } else if (humanName === "LightManager$getDirection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getDirection(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getDirection called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setColor") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function LightManager$setColor(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setColor called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // float3
          };
        };
      } else if (humanName === "LightManager$getColor") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getColor(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getColor called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Renderer$_setClearOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Renderer$_setClearOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Renderer._setClearOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Renderer$ClearOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // Renderer$ClearOptions
          };
        };
      } else if (humanName === "Frustum$getNormalizedPlane") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Frustum$getNormalizedPlane(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Frustum.getNormalizedPlane called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Frustum$Plane
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Frustum$intersectsSphere") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Frustum$intersectsSphere(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Frustum.intersectsSphere called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float4
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float4
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (
        humanName === "ColorGrading$Builder$shadowsMidtonesHighlights"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          arg0Wired_dtor,
          arg1Wired_dtor,
          arg2Wired_dtor,
          arg3Wired_dtor
        ) {
          return function ColorGrading$Builder$shadowsMidtonesHighlights(
            arg0,
            arg1,
            arg2,
            arg3
          ) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function ColorGrading$Builder.shadowsMidtonesHighlights called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float4
            var arg1Wired = argType1.toWireType(null, arg1); // float4
            var arg2Wired = argType2.toWireType(null, arg2); // float4
            var arg3Wired = argType3.toWireType(null, arg3); // float4
            var rv = invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired
            );
            arg0Wired_dtor(arg0Wired); // float4
            arg1Wired_dtor(arg1Wired); // float4
            arg2Wired_dtor(arg2Wired); // float4
            arg3Wired_dtor(arg3Wired); // float4
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Skybox$setColor") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Skybox$setColor(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Skybox.setColor called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float4
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float4
          };
        };
      } else if (humanName === "Skybox$Builder$color") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Skybox$Builder$color(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Skybox$Builder.color called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float4
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // float4
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$_shadowOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function LightManager$Builder$_shadowOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder._shadowOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$ShadowOptions
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // LightManager$ShadowOptions
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$_setShadowOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function LightManager$_setShadowOptions(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager._setShadowOptions called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // LightManager$ShadowOptions
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // LightManager$ShadowOptions
          };
        };
      } else if (humanName === "constructor$Frustum") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function constructor$Frustum(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function constructor Frustum called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // mat4
            var rv = invoker(fn, arg0Wired);
            arg0Wired_dtor(arg0Wired); // mat4
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Frustum$setProjection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Frustum$setProjection(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Frustum.setProjection called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // mat4
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // mat4
          };
        };
      } else if (humanName === "Camera$getProjectionMatrix") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getProjectionMatrix() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getProjectionMatrix called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getCullingProjectionMatrix") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getCullingProjectionMatrix() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getCullingProjectionMatrix called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$setModelMatrix") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Camera$setModelMatrix(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Camera.setModelMatrix called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // mat4
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // mat4
          };
        };
      } else if (humanName === "Camera$getModelMatrix") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getModelMatrix() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getModelMatrix called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getViewMatrix") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getViewMatrix() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getViewMatrix called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$inverseProjection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Camera$inverseProjection(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Camera.inverseProjection called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // mat4
            var rv = invoker(fn, arg0Wired);
            arg0Wired_dtor(arg0Wired); // mat4
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TransformManager$setTransform") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function TransformManager$setTransform(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function TransformManager.setTransform called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransformManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // mat4
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // mat4
          };
        };
      } else if (humanName === "TransformManager$getTransform") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$getTransform(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.getTransform called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransformManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TransformManager$getWorldTransform") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TransformManager$getWorldTransform(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TransformManager.getWorldTransform called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // TransformManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "multiplyMatrices") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function multiplyMatrices(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function multiplyMatrices called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // mat4
            var arg1Wired = argType1.toWireType(null, arg1); // mat4
            var rv = invoker(fn, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // mat4
            arg1Wired_dtor(arg1Wired); // mat4
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$setRotation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function IndirectLight$setRotation(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight.setRotation called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // mat3
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // mat3
          };
        };
      } else if (humanName === "IndirectLight$getRotation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function IndirectLight$getRotation() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function IndirectLight.getRotation called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder$rotation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function IndirectLight$Builder$rotation(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight$Builder.rotation called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // mat3
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // mat3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$setExposure") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function Camera$setExposure(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function Camera.setExposure called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var arg2Wired = argType2.toWireType(null, arg2); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "Camera$setExposureDirect") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Camera$setExposureDirect(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Camera.setExposureDirect called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Camera$getAperture") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getAperture() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getAperture called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getShutterSpeed") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getShutterSpeed() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getShutterSpeed called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getSensitivity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getSensitivity() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getSensitivity called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$setFocusDistance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function Camera$setFocusDistance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Camera.setFocusDistance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "Camera$getFocusDistance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getFocusDistance() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getFocusDistance called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$exposure") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$exposure(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.exposure called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$nightAdaptation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$nightAdaptation(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.nightAdaptation called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$whiteBalance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function ColorGrading$Builder$whiteBalance(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function ColorGrading$Builder.whiteBalance called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$contrast") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$contrast(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.contrast called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$vibrance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$vibrance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.vibrance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "ColorGrading$Builder$saturation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function ColorGrading$Builder$saturation(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function ColorGrading$Builder.saturation called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$intensity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$intensity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.intensity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$falloff") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$falloff(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.falloff called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$spotLightCone") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$Builder$spotLightCone(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager$Builder.spotLightCone called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$sunAngularRadius") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$sunAngularRadius(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.sunAngularRadius called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$sunHaloSize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$sunHaloSize(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.sunHaloSize called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$Builder$sunHaloFalloff") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$Builder$sunHaloFalloff(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager$Builder.sunHaloFalloff called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setIntensity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$setIntensity(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setIntensity called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "LightManager$setIntensityEnergy") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function LightManager$setIntensityEnergy(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function LightManager.setIntensityEnergy called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var arg2Wired = argType2.toWireType(null, arg2); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "LightManager$getIntensity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getIntensity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getIntensity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setFalloff") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$setFalloff(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setFalloff called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "LightManager$getFalloff") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getFalloff(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getFalloff called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setSpotLightCone") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function LightManager$setSpotLightCone(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function LightManager.setSpotLightCone called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var arg2Wired = argType2.toWireType(null, arg2); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "LightManager$setSunAngularRadius") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$setSunAngularRadius(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setSunAngularRadius called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "LightManager$getSunAngularRadius") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getSunAngularRadius(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getSunAngularRadius called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setSunHaloSize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$setSunHaloSize(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setSunHaloSize called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "LightManager$getSunHaloSize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getSunHaloSize(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getSunHaloSize called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "LightManager$setSunHaloFalloff") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function LightManager$setSunHaloFalloff(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function LightManager.setSunHaloFalloff called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "LightManager$getSunHaloFalloff") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function LightManager$getSunHaloFalloff(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function LightManager.getSunHaloFalloff called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // LightManager$Instance
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$setPolygonOffset") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function MaterialInstance$setPolygonOffset(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setPolygonOffset called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "MaterialInstance$setMaskThreshold") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setMaskThreshold(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setMaskThreshold called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "MaterialInstance$getMaskThreshold") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$getMaskThreshold() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.getMaskThreshold called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (
        humanName === "MaterialInstance$setSpecularAntiAliasingVariance"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setSpecularAntiAliasingVariance(
            arg0
          ) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setSpecularAntiAliasingVariance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (
        humanName === "MaterialInstance$getSpecularAntiAliasingVariance"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$getSpecularAntiAliasingVariance() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.getSpecularAntiAliasingVariance called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (
        humanName === "MaterialInstance$setSpecularAntiAliasingThreshold"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstance$setSpecularAntiAliasingThreshold(
            arg0
          ) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstance.setSpecularAntiAliasingThreshold called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (
        humanName === "MaterialInstance$getSpecularAntiAliasingThreshold"
      ) {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$getSpecularAntiAliasingThreshold() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.getSpecularAntiAliasingThreshold called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "TextureSampler$setAnisotropy") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function TextureSampler$setAnisotropy(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function TextureSampler.setAnisotropy called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "IndirectLight$setIntensity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndirectLight$setIntensity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight.setIntensity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "IndirectLight$getIntensity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function IndirectLight$getIntensity() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function IndirectLight.getIntensity called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder$intensity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndirectLight$Builder$intensity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight$Builder.intensity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$Animator$applyAnimation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function gltfio$Animator$applyAnimation(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$Animator.applyAnimation called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "gltfio$Animator$applyCrossFade") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function gltfio$Animator$applyCrossFade(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function gltfio$Animator.applyCrossFade called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var arg2Wired = argType2.toWireType(null, arg2); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "gltfio$Animator$getAnimationDuration") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$Animator$getAnimationDuration(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$Animator.getAnimationDuration called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$Avatar$ShowAvatar") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$Avatar$ShowAvatar(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$Avatar.ShowAvatar called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$asyncGetLoadProgress") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function gltfio$ResourceLoader$asyncGetLoadProgress() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function gltfio$ResourceLoader.asyncGetLoadProgress called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTAnimator$applyAnimation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function CTAnimator$applyAnimation(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function CTAnimator.applyAnimation called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // CTScene
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "ViewerGui$renderUserInterface") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function ViewerGui$renderUserInterface(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function ViewerGui.renderUserInterface called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // View*
            var arg2Wired = argType2.toWireType(null, arg2); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "ViewerGui$mouseEvent") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4
        ) {
          return function ViewerGui$mouseEvent(arg0, arg1, arg2, arg3, arg4) {
            if (arguments.length !== 5) {
              throwBindingError(
                "function ViewerGui.mouseEvent called with " +
                  arguments.length +
                  " arguments, expected 5 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // float
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var arg2Wired = argType2.toWireType(null, arg2); // bool
            var arg3Wired = argType3.toWireType(null, arg3); // float
            var arg4Wired = argType4.toWireType(null, arg4); // bool
            invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired
            );
          };
        };
      } else if (humanName === "fitIntoUnitCube") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function fitIntoUnitCube(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function fitIntoUnitCube called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // Aabb
            var arg1Wired = argType1.toWireType(null, arg1); // float
            var rv = invoker(fn, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // Aabb
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$_setBloomOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setBloomOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setBloomOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$BloomOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$BloomOptions
          };
        };
      } else if (humanName === "View$_setFogOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setFogOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setFogOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$FogOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$FogOptions
          };
        };
      } else if (humanName === "View$_setDepthOfFieldOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setDepthOfFieldOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setDepthOfFieldOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$DepthOfFieldOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$DepthOfFieldOptions
          };
        };
      } else if (humanName === "View$_setVignetteOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setVignetteOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setVignetteOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$VignetteOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$VignetteOptions
          };
        };
      } else if (humanName === "View$_setAmbientOcclusionOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setAmbientOcclusionOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setAmbientOcclusionOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$AmbientOcclusionOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$AmbientOcclusionOptions
          };
        };
      } else if (humanName === "View$_setTemporalAntiAliasingOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setTemporalAntiAliasingOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setTemporalAntiAliasingOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$TemporalAntiAliasingOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$TemporalAntiAliasingOptions
          };
        };
      } else if (humanName === "View$_setScreenSpaceReflectionsOptions") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function View$_setScreenSpaceReflectionsOptions(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function View._setScreenSpaceReflectionsOptions called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // View$ScreenSpaceReflectionsOptions
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // View$ScreenSpaceReflectionsOptions
          };
        };
      } else if (humanName === "Camera$setScaling") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Camera$setScaling(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Camera.setScaling called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // double2
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // double2
          };
        };
      } else if (humanName === "Camera$getPosition") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getPosition() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getPosition called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getScaling") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getScaling() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getScaling called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$setProjection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4,
          argType5,
          argType6
        ) {
          return function Camera$setProjection(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5,
            arg6
          ) {
            if (arguments.length !== 7) {
              throwBindingError(
                "function Camera.setProjection called with " +
                  arguments.length +
                  " arguments, expected 7 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Camera$Projection
            var arg1Wired = argType1.toWireType(null, arg1); // double
            var arg2Wired = argType2.toWireType(null, arg2); // double
            var arg3Wired = argType3.toWireType(null, arg3); // double
            var arg4Wired = argType4.toWireType(null, arg4); // double
            var arg5Wired = argType5.toWireType(null, arg5); // double
            var arg6Wired = argType6.toWireType(null, arg6); // double
            invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired,
              arg5Wired,
              arg6Wired
            );
          };
        };
      } else if (humanName === "Camera$setProjectionFov") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4
        ) {
          return function Camera$setProjectionFov(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4
          ) {
            if (arguments.length !== 5) {
              throwBindingError(
                "function Camera.setProjectionFov called with " +
                  arguments.length +
                  " arguments, expected 5 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // double
            var arg1Wired = argType1.toWireType(null, arg1); // double
            var arg2Wired = argType2.toWireType(null, arg2); // double
            var arg3Wired = argType3.toWireType(null, arg3); // double
            var arg4Wired = argType4.toWireType(null, arg4); // Camera$Fov
            invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired
            );
          };
        };
      } else if (humanName === "Camera$setLensProjection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3
        ) {
          return function Camera$setLensProjection(arg0, arg1, arg2, arg3) {
            if (arguments.length !== 4) {
              throwBindingError(
                "function Camera.setLensProjection called with " +
                  arguments.length +
                  " arguments, expected 4 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // double
            var arg1Wired = argType1.toWireType(null, arg1); // double
            var arg2Wired = argType2.toWireType(null, arg2); // double
            var arg3Wired = argType3.toWireType(null, arg3); // double
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired, arg3Wired);
          };
        };
      } else if (humanName === "Camera$setCustomProjection") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor
        ) {
          return function Camera$setCustomProjection(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function Camera.setCustomProjection called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // mat4
            var arg1Wired = argType1.toWireType(null, arg1); // double
            var arg2Wired = argType2.toWireType(null, arg2); // double
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // mat4
          };
        };
      } else if (humanName === "Camera$getNear") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getNear() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getNear called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getCullingFar") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getCullingFar() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getCullingFar called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$getFocalLength") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Camera$getFocalLength() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Camera.getFocalLength called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$computeEffectiveFocalLength") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Camera$computeEffectiveFocalLength(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Camera.computeEffectiveFocalLength called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // double
            var arg1Wired = argType1.toWireType(null, arg1); // double
            var rv = invoker(fn, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Camera$computeEffectiveFov") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function Camera$computeEffectiveFov(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function Camera.computeEffectiveFov called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // double
            var arg1Wired = argType1.toWireType(null, arg1); // double
            var rv = invoker(fn, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$ApplyAnimation") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function CTScene$ApplyAnimation(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.ApplyAnimation called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // double
            invoker(fn, thisWired, arg0Wired);
          };
        };
      } else if (humanName === "RegistryKeys$push_back") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function RegistryKeys$push_back(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RegistryKeys.push_back called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "RegistryKeys$resize") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function RegistryKeys$resize(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RegistryKeys.resize called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // std::string
          };
        };
      } else if (humanName === "RegistryKeys$set") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function RegistryKeys$set(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RegistryKeys.set called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Material$createNamedInstance") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Material$createNamedInstance(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Material.createNamedInstance called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "Material$getName") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Material$getName() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Material.getName called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$getName") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function MaterialInstance$getName() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function MaterialInstance.getName called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstance$setBoolParameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function MaterialInstance$setBoolParameter(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setBoolParameter called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // bool
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "MaterialInstance$setFloatParameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function MaterialInstance$setFloatParameter(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setFloatParameter called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // float
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "MaterialInstance$setFloat2Parameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function MaterialInstance$setFloat2Parameter(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setFloat2Parameter called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // float2
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // float2
          };
        };
      } else if (humanName === "MaterialInstance$setFloat3Parameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function MaterialInstance$setFloat3Parameter(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setFloat3Parameter called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // float3
          };
        };
      } else if (humanName === "MaterialInstance$setFloat4Parameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function MaterialInstance$setFloat4Parameter(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MaterialInstance.setFloat4Parameter called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // float4
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // float4
          };
        };
      } else if (humanName === "MaterialInstance$setTextureParameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor
        ) {
          return function MaterialInstance$setTextureParameter(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function MaterialInstance.setTextureParameter called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // Texture*
            var arg2Wired = argType2.toWireType(null, arg2); // TextureSampler
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "MaterialInstance$setColor3Parameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg2Wired_dtor
        ) {
          return function MaterialInstance$setColor3Parameter(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function MaterialInstance.setColor3Parameter called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // RgbType
            var arg2Wired = argType2.toWireType(null, arg2); // float3
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg2Wired_dtor(arg2Wired); // float3
          };
        };
      } else if (humanName === "MaterialInstance$setColor4Parameter") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg2Wired_dtor
        ) {
          return function MaterialInstance$setColor4Parameter(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function MaterialInstance.setColor4Parameter called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // RgbaType
            var arg2Wired = argType2.toWireType(null, arg2); // float4
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg2Wired_dtor(arg2Wired); // float4
          };
        };
      } else if (humanName === "Ktx1Bundle$getMetadata") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function Ktx1Bundle$getMetadata(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function Ktx1Bundle.getMetadata called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$MaterialRegistry$set") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function MeshReader$MaterialRegistry$set(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function MeshReader$MaterialRegistry.set called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // MaterialInstance*
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$Animator$getAnimationName") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$Animator$getAnimationName(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$Animator.getAnimationName called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$Avatar$Init") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function gltfio$Avatar$Init(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$Avatar.Init called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$Avatar$ProcessTTS") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function gltfio$Avatar$ProcessTTS(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$Avatar.ProcessTTS called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$Avatar$PlayNonStreamingFile") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function gltfio$Avatar$PlayNonStreamingFile(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$Avatar.PlayNonStreamingFile called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$Avatar$writeFile") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function gltfio$Avatar$writeFile(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$Avatar.writeFile called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$Avatar$StartPlayStreamingTTS") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          argType3,
          argType4,
          argType5,
          argType6,
          arg0Wired_dtor,
          arg1Wired_dtor,
          arg3Wired_dtor
        ) {
          return function gltfio$Avatar$StartPlayStreamingTTS(
            arg0,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5,
            arg6
          ) {
            if (arguments.length !== 7) {
              throwBindingError(
                "function gltfio$Avatar.StartPlayStreamingTTS called with " +
                  arguments.length +
                  " arguments, expected 7 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            var arg2Wired = argType2.toWireType(null, arg2); // int
            var arg3Wired = argType3.toWireType(null, arg3); // std::string
            var arg4Wired = argType4.toWireType(null, arg4); // int
            var arg5Wired = argType5.toWireType(null, arg5); // int
            var arg6Wired = argType6.toWireType(null, arg6); // bool
            invoker(
              fn,
              thisWired,
              arg0Wired,
              arg1Wired,
              arg2Wired,
              arg3Wired,
              arg4Wired,
              arg5Wired,
              arg6Wired
            );
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // std::string
            arg3Wired_dtor(arg3Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$FileLoader$loadSettings") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function gltfio$FileLoader$loadSettings(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$FileLoader.loadSettings called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // ViewerGui*
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$FileLoader$_loadFile") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function gltfio$FileLoader$_loadFile(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$FileLoader._loadFile called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // driver$BufferDescriptor
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getEntitiesByName") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function gltfio$CTEngineAsset$_getEntitiesByName(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getEntitiesByName called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$_getEntitiesByPrefix") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function gltfio$CTEngineAsset$_getEntitiesByPrefix(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$CTEngineAsset._getEntitiesByPrefix called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getFirstEntityByName") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function gltfio$CTEngineAsset$getFirstEntityByName(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getFirstEntityByName called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getName") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$CTEngineAsset$getName(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getName called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$CTEngineAsset$getExtras") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function gltfio$CTEngineAsset$getExtras(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$CTEngineAsset.getExtras called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Entity
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$addResourceData") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function gltfio$ResourceLoader$addResourceData(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$ResourceLoader.addResourceData called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // driver$BufferDescriptor
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$addStbProvider") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function gltfio$ResourceLoader$addStbProvider(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$ResourceLoader.addStbProvider called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$StbProvider
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$addKtx2Provider") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor
        ) {
          return function gltfio$ResourceLoader$addKtx2Provider(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function gltfio$ResourceLoader.addKtx2Provider called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$Ktx2Provider
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "gltfio$ResourceLoader$hasResourceData") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function gltfio$ResourceLoader$hasResourceData(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function gltfio$ResourceLoader.hasResourceData called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$loadScene") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2,
          arg0Wired_dtor,
          arg2Wired_dtor
        ) {
          return function CTScene$loadScene(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function CTScene.loadScene called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // gltfio$AssetLoader*
            var arg2Wired = argType2.toWireType(null, arg2); // std::string
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg2Wired_dtor(arg2Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "CTScene$SetConfig") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function CTScene$SetConfig(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.SetConfig called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "CTScene$SetSkybox") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function CTScene$SetSkybox(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.SetSkybox called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "CTScene$AddEntity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg0Wired_dtor,
          arg1Wired_dtor
        ) {
          return function CTScene$AddEntity(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function CTScene.AddEntity called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var arg1Wired = argType1.toWireType(null, arg1); // std::string
            invoker(fn, thisWired, arg0Wired, arg1Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            arg1Wired_dtor(arg1Wired); // std::string
          };
        };
      } else if (humanName === "CTScene$RemoveEntity") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function CTScene$RemoveEntity(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function CTScene.RemoveEntity called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
          };
        };
      } else if (humanName === "JsonSerializer$writeJson") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function JsonSerializer$writeJson(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function JsonSerializer.writeJson called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // Settings
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RegistryKeys$get") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RegistryKeys$get(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RegistryKeys.get called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "EntityVector$get") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function EntityVector$get(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function EntityVector.get called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "AssetInstanceVector$get") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function AssetInstanceVector$get(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function AssetInstanceVector.get called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MaterialInstanceVector$get") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function MaterialInstanceVector$get(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MaterialInstanceVector.get called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned long
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "View$pick") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function View$pick(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function View.pick called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned int
            var arg1Wired = argType1.toWireType(null, arg1); // unsigned int
            var arg2Wired = argType2.toWireType(null, arg2); // emscripten::val
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$Builder$skinningBones") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$skinningBones(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.skinningBones called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // emscripten::val
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$Builder$skinningMatrices") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function RenderableManager$Builder$skinningMatrices(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function RenderableManager$Builder.skinningMatrices called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // emscripten::val
            var rv = invoker(fn, thisWired, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "RenderableManager$setBones") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setBones(arg0, arg1, arg2) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setBones called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // emscripten::val
            var arg2Wired = argType2.toWireType(null, arg2); // unsigned long
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$setBonesFromMatrices") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          argType2
        ) {
          return function RenderableManager$setBonesFromMatrices(
            arg0,
            arg1,
            arg2
          ) {
            if (arguments.length !== 3) {
              throwBindingError(
                "function RenderableManager.setBonesFromMatrices called with " +
                  arguments.length +
                  " arguments, expected 3 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // emscripten::val
            var arg2Wired = argType2.toWireType(null, arg2); // unsigned long
            invoker(fn, thisWired, arg0Wired, arg1Wired, arg2Wired);
          };
        };
      } else if (humanName === "RenderableManager$setMorphWeights") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function RenderableManager$setMorphWeights(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function RenderableManager.setMorphWeights called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // RenderableManager$Instance
            var arg1Wired = argType1.toWireType(null, arg1); // emscripten::val
            invoker(fn, thisWired, arg0Wired, arg1Wired);
          };
        };
      } else if (humanName === "IndirectLight$getDirectionEstimate") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0
        ) {
          return function IndirectLight$getDirectionEstimate(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function IndirectLight.getDirectionEstimate called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // emscripten::val
            var rv = invoker(fn, arg0Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$getColorEstimate") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1,
          arg1Wired_dtor
        ) {
          return function IndirectLight$getColorEstimate(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function IndirectLight.getColorEstimate called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var arg0Wired = argType0.toWireType(null, arg0); // emscripten::val
            var arg1Wired = argType1.toWireType(null, arg1); // float3
            var rv = invoker(fn, arg0Wired, arg1Wired);
            arg1Wired_dtor(arg1Wired); // float3
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "IndirectLight$Builder$irradianceSh") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          argType1
        ) {
          return function IndirectLight$Builder$irradianceSh(arg0, arg1) {
            if (arguments.length !== 2) {
              throwBindingError(
                "function IndirectLight$Builder.irradianceSh called with " +
                  arguments.length +
                  " arguments, expected 2 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // unsigned char
            var arg1Wired = argType1.toWireType(null, arg1); // emscripten::val
            var rv = invoker(fn, thisWired, arg0Wired, arg1Wired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "driver$BufferDescriptor$getBytes") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function driver$BufferDescriptor$getBytes() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function driver$BufferDescriptor.getBytes called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "driver$PixelBufferDescriptor$getBytes") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function driver$PixelBufferDescriptor$getBytes() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function driver$PixelBufferDescriptor.getBytes called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (humanName === "MeshReader$MaterialRegistry$get") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam,
          argType0,
          arg0Wired_dtor
        ) {
          return function MeshReader$MaterialRegistry$get(arg0) {
            if (arguments.length !== 1) {
              throwBindingError(
                "function MeshReader$MaterialRegistry.get called with " +
                  arguments.length +
                  " arguments, expected 1 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var arg0Wired = argType0.toWireType(null, arg0); // std::string
            var rv = invoker(fn, thisWired, arg0Wired);
            arg0Wired_dtor(arg0Wired); // std::string
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else if (name === "InternalError") {
        var ret = function InternalError() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "BindingError") {
        var ret = function BindingError() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "UnboundTypeError") {
        var ret = function UnboundTypeError() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RgbType_sRGB") {
        var ret = function RgbType_sRGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RgbType_LINEAR") {
        var ret = function RgbType_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RgbaType_sRGB") {
        var ret = function RgbaType_sRGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RgbaType_LINEAR") {
        var ret = function RgbaType_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RgbaType_PREMULTIPLIED_sRGB") {
        var ret = function RgbaType_PREMULTIPLIED_sRGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RgbaType_PREMULTIPLIED_LINEAR") {
        var ret = function RgbaType_PREMULTIPLIED_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_POSITION") {
        var ret = function VertexAttribute_POSITION() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_TANGENTS") {
        var ret = function VertexAttribute_TANGENTS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_COLOR") {
        var ret = function VertexAttribute_COLOR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_UV0") {
        var ret = function VertexAttribute_UV0() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_UV1") {
        var ret = function VertexAttribute_UV1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_BONE_INDICES") {
        var ret = function VertexAttribute_BONE_INDICES() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_BONE_WEIGHTS") {
        var ret = function VertexAttribute_BONE_WEIGHTS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM0") {
        var ret = function VertexAttribute_CUSTOM0() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM1") {
        var ret = function VertexAttribute_CUSTOM1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM2") {
        var ret = function VertexAttribute_CUSTOM2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM3") {
        var ret = function VertexAttribute_CUSTOM3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM4") {
        var ret = function VertexAttribute_CUSTOM4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM5") {
        var ret = function VertexAttribute_CUSTOM5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM6") {
        var ret = function VertexAttribute_CUSTOM6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_CUSTOM7") {
        var ret = function VertexAttribute_CUSTOM7() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_POSITION_0") {
        var ret = function VertexAttribute_MORPH_POSITION_0() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_POSITION_1") {
        var ret = function VertexAttribute_MORPH_POSITION_1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_POSITION_2") {
        var ret = function VertexAttribute_MORPH_POSITION_2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_POSITION_3") {
        var ret = function VertexAttribute_MORPH_POSITION_3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_TANGENTS_0") {
        var ret = function VertexAttribute_MORPH_TANGENTS_0() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_TANGENTS_1") {
        var ret = function VertexAttribute_MORPH_TANGENTS_1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_TANGENTS_2") {
        var ret = function VertexAttribute_MORPH_TANGENTS_2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexAttribute_MORPH_TANGENTS_3") {
        var ret = function VertexAttribute_MORPH_TANGENTS_3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "BufferObject$BindingType_VERTEX") {
        var ret = function BufferObject$BindingType_VERTEX() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_BYTE") {
        var ret = function VertexBuffer$AttributeType_BYTE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_BYTE2") {
        var ret = function VertexBuffer$AttributeType_BYTE2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_BYTE3") {
        var ret = function VertexBuffer$AttributeType_BYTE3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_BYTE4") {
        var ret = function VertexBuffer$AttributeType_BYTE4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_UBYTE") {
        var ret = function VertexBuffer$AttributeType_UBYTE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_UBYTE2") {
        var ret = function VertexBuffer$AttributeType_UBYTE2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_UBYTE3") {
        var ret = function VertexBuffer$AttributeType_UBYTE3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_UBYTE4") {
        var ret = function VertexBuffer$AttributeType_UBYTE4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_SHORT") {
        var ret = function VertexBuffer$AttributeType_SHORT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_SHORT2") {
        var ret = function VertexBuffer$AttributeType_SHORT2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_SHORT3") {
        var ret = function VertexBuffer$AttributeType_SHORT3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_SHORT4") {
        var ret = function VertexBuffer$AttributeType_SHORT4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_USHORT") {
        var ret = function VertexBuffer$AttributeType_USHORT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_USHORT2") {
        var ret = function VertexBuffer$AttributeType_USHORT2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_USHORT3") {
        var ret = function VertexBuffer$AttributeType_USHORT3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_USHORT4") {
        var ret = function VertexBuffer$AttributeType_USHORT4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_INT") {
        var ret = function VertexBuffer$AttributeType_INT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_UINT") {
        var ret = function VertexBuffer$AttributeType_UINT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_FLOAT") {
        var ret = function VertexBuffer$AttributeType_FLOAT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_FLOAT2") {
        var ret = function VertexBuffer$AttributeType_FLOAT2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_FLOAT3") {
        var ret = function VertexBuffer$AttributeType_FLOAT3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_FLOAT4") {
        var ret = function VertexBuffer$AttributeType_FLOAT4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_HALF") {
        var ret = function VertexBuffer$AttributeType_HALF() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_HALF2") {
        var ret = function VertexBuffer$AttributeType_HALF2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_HALF3") {
        var ret = function VertexBuffer$AttributeType_HALF3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$AttributeType_HALF4") {
        var ret = function VertexBuffer$AttributeType_HALF4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "IndexBuffer$IndexType_USHORT") {
        var ret = function IndexBuffer$IndexType_USHORT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "IndexBuffer$IndexType_UINT") {
        var ret = function IndexBuffer$IndexType_UINT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Type_SUN") {
        var ret = function LightManager$Type_SUN() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Type_DIRECTIONAL") {
        var ret = function LightManager$Type_DIRECTIONAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Type_POINT") {
        var ret = function LightManager$Type_POINT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Type_FOCUSED_SPOT") {
        var ret = function LightManager$Type_FOCUSED_SPOT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Type_SPOT") {
        var ret = function LightManager$Type_SPOT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$PrimitiveType_POINTS") {
        var ret = function RenderableManager$PrimitiveType_POINTS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$PrimitiveType_LINES") {
        var ret = function RenderableManager$PrimitiveType_LINES() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$PrimitiveType_LINE_STRIP") {
        var ret = function RenderableManager$PrimitiveType_LINE_STRIP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$PrimitiveType_TRIANGLES") {
        var ret = function RenderableManager$PrimitiveType_TRIANGLES() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$PrimitiveType_TRIANGLE_STRIP") {
        var ret = function RenderableManager$PrimitiveType_TRIANGLE_STRIP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$AmbientOcclusion_NONE") {
        var ret = function View$AmbientOcclusion_NONE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$AmbientOcclusion_SSAO") {
        var ret = function View$AmbientOcclusion_SSAO() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Camera$Fov_VERTICAL") {
        var ret = function Camera$Fov_VERTICAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Camera$Fov_HORIZONTAL") {
        var ret = function Camera$Fov_HORIZONTAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Camera$Projection_PERSPECTIVE") {
        var ret = function Camera$Projection_PERSPECTIVE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Camera$Projection_ORTHO") {
        var ret = function Camera$Projection_ORTHO() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$QualityLevel_LOW") {
        var ret = function ColorGrading$QualityLevel_LOW() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$QualityLevel_MEDIUM") {
        var ret = function ColorGrading$QualityLevel_MEDIUM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$QualityLevel_HIGH") {
        var ret = function ColorGrading$QualityLevel_HIGH() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$QualityLevel_ULTRA") {
        var ret = function ColorGrading$QualityLevel_ULTRA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$ToneMapping_LINEAR") {
        var ret = function ColorGrading$ToneMapping_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$ToneMapping_ACES_LEGACY") {
        var ret = function ColorGrading$ToneMapping_ACES_LEGACY() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$ToneMapping_ACES") {
        var ret = function ColorGrading$ToneMapping_ACES() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$ToneMapping_FILMIC") {
        var ret = function ColorGrading$ToneMapping_FILMIC() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$ToneMapping_DISPLAY_RANGE") {
        var ret = function ColorGrading$ToneMapping_DISPLAY_RANGE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$LutFormat_INTEGER") {
        var ret = function ColorGrading$LutFormat_INTEGER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$LutFormat_FLOAT") {
        var ret = function ColorGrading$LutFormat_FLOAT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum$Plane_LEFT") {
        var ret = function Frustum$Plane_LEFT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum$Plane_RIGHT") {
        var ret = function Frustum$Plane_RIGHT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum$Plane_BOTTOM") {
        var ret = function Frustum$Plane_BOTTOM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum$Plane_TOP") {
        var ret = function Frustum$Plane_TOP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum$Plane_FAR") {
        var ret = function Frustum$Plane_FAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum$Plane_NEAR") {
        var ret = function Frustum$Plane_NEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Sampler_SAMPLER_2D") {
        var ret = function Texture$Sampler_SAMPLER_2D() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Sampler_SAMPLER_CUBEMAP") {
        var ret = function Texture$Sampler_SAMPLER_CUBEMAP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Sampler_SAMPLER_EXTERNAL") {
        var ret = function Texture$Sampler_SAMPLER_EXTERNAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R8") {
        var ret = function Texture$InternalFormat_R8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R8_SNORM") {
        var ret = function Texture$InternalFormat_R8_SNORM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R8UI") {
        var ret = function Texture$InternalFormat_R8UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R8I") {
        var ret = function Texture$InternalFormat_R8I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_STENCIL8") {
        var ret = function Texture$InternalFormat_STENCIL8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R16F") {
        var ret = function Texture$InternalFormat_R16F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R16UI") {
        var ret = function Texture$InternalFormat_R16UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R16I") {
        var ret = function Texture$InternalFormat_R16I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG8") {
        var ret = function Texture$InternalFormat_RG8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG8_SNORM") {
        var ret = function Texture$InternalFormat_RG8_SNORM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG8UI") {
        var ret = function Texture$InternalFormat_RG8UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG8I") {
        var ret = function Texture$InternalFormat_RG8I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB565") {
        var ret = function Texture$InternalFormat_RGB565() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB9_E5") {
        var ret = function Texture$InternalFormat_RGB9_E5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB5_A1") {
        var ret = function Texture$InternalFormat_RGB5_A1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA4") {
        var ret = function Texture$InternalFormat_RGBA4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DEPTH16") {
        var ret = function Texture$InternalFormat_DEPTH16() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB8") {
        var ret = function Texture$InternalFormat_RGB8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8") {
        var ret = function Texture$InternalFormat_SRGB8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB8_SNORM") {
        var ret = function Texture$InternalFormat_RGB8_SNORM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB8UI") {
        var ret = function Texture$InternalFormat_RGB8UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB8I") {
        var ret = function Texture$InternalFormat_RGB8I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DEPTH24") {
        var ret = function Texture$InternalFormat_DEPTH24() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R32F") {
        var ret = function Texture$InternalFormat_R32F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R32UI") {
        var ret = function Texture$InternalFormat_R32UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R32I") {
        var ret = function Texture$InternalFormat_R32I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG16F") {
        var ret = function Texture$InternalFormat_RG16F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG16UI") {
        var ret = function Texture$InternalFormat_RG16UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG16I") {
        var ret = function Texture$InternalFormat_RG16I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_R11F_G11F_B10F") {
        var ret = function Texture$InternalFormat_R11F_G11F_B10F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA8") {
        var ret = function Texture$InternalFormat_RGBA8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_A8") {
        var ret = function Texture$InternalFormat_SRGB8_A8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA8_SNORM") {
        var ret = function Texture$InternalFormat_RGBA8_SNORM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_UNUSED") {
        var ret = function Texture$InternalFormat_UNUSED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB10_A2") {
        var ret = function Texture$InternalFormat_RGB10_A2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA8UI") {
        var ret = function Texture$InternalFormat_RGBA8UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA8I") {
        var ret = function Texture$InternalFormat_RGBA8I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DEPTH32F") {
        var ret = function Texture$InternalFormat_DEPTH32F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DEPTH24_STENCIL8") {
        var ret = function Texture$InternalFormat_DEPTH24_STENCIL8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DEPTH32F_STENCIL8") {
        var ret = function Texture$InternalFormat_DEPTH32F_STENCIL8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB16F") {
        var ret = function Texture$InternalFormat_RGB16F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB16UI") {
        var ret = function Texture$InternalFormat_RGB16UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB16I") {
        var ret = function Texture$InternalFormat_RGB16I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG32F") {
        var ret = function Texture$InternalFormat_RG32F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG32UI") {
        var ret = function Texture$InternalFormat_RG32UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RG32I") {
        var ret = function Texture$InternalFormat_RG32I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA16F") {
        var ret = function Texture$InternalFormat_RGBA16F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA16UI") {
        var ret = function Texture$InternalFormat_RGBA16UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA16I") {
        var ret = function Texture$InternalFormat_RGBA16I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB32F") {
        var ret = function Texture$InternalFormat_RGB32F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB32UI") {
        var ret = function Texture$InternalFormat_RGB32UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGB32I") {
        var ret = function Texture$InternalFormat_RGB32I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA32F") {
        var ret = function Texture$InternalFormat_RGBA32F() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA32UI") {
        var ret = function Texture$InternalFormat_RGBA32UI() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA32I") {
        var ret = function Texture$InternalFormat_RGBA32I() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_EAC_R11") {
        var ret = function Texture$InternalFormat_EAC_R11() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_EAC_R11_SIGNED") {
        var ret = function Texture$InternalFormat_EAC_R11_SIGNED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_EAC_RG11") {
        var ret = function Texture$InternalFormat_EAC_RG11() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_EAC_RG11_SIGNED") {
        var ret = function Texture$InternalFormat_EAC_RG11_SIGNED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_ETC2_RGB8") {
        var ret = function Texture$InternalFormat_ETC2_RGB8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_ETC2_SRGB8") {
        var ret = function Texture$InternalFormat_ETC2_SRGB8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_ETC2_RGB8_A1") {
        var ret = function Texture$InternalFormat_ETC2_RGB8_A1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_ETC2_SRGB8_A1") {
        var ret = function Texture$InternalFormat_ETC2_SRGB8_A1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_ETC2_EAC_RGBA8") {
        var ret = function Texture$InternalFormat_ETC2_EAC_RGBA8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_ETC2_EAC_SRGBA8") {
        var ret = function Texture$InternalFormat_ETC2_EAC_SRGBA8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT1_RGB") {
        var ret = function Texture$InternalFormat_DXT1_RGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT1_RGBA") {
        var ret = function Texture$InternalFormat_DXT1_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT3_RGBA") {
        var ret = function Texture$InternalFormat_DXT3_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT5_RGBA") {
        var ret = function Texture$InternalFormat_DXT5_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT1_SRGB") {
        var ret = function Texture$InternalFormat_DXT1_SRGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT1_SRGBA") {
        var ret = function Texture$InternalFormat_DXT1_SRGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT3_SRGBA") {
        var ret = function Texture$InternalFormat_DXT3_SRGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_DXT5_SRGBA") {
        var ret = function Texture$InternalFormat_DXT5_SRGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_4x4") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_4x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_5x4") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_5x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_5x5") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_5x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_6x5") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_6x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_6x6") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_6x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_8x5") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_8x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_8x6") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_8x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_8x8") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_8x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_10x5") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_10x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_10x6") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_10x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_10x8") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_10x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_10x10") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_10x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_12x10") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_12x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_RGBA_ASTC_12x12") {
        var ret = function Texture$InternalFormat_RGBA_ASTC_12x12() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_4x4") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_4x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_5x4") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_5x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_5x5") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_5x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_6x5") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_6x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_6x6") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_6x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_8x5") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_8x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_8x6") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_8x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_8x8") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_8x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x5") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x6") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x8") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x10") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_10x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_12x10") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_12x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$InternalFormat_SRGB8_ALPHA8_ASTC_12x12") {
        var ret = function Texture$InternalFormat_SRGB8_ALPHA8_ASTC_12x12() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_DEFAULT") {
        var ret = function Texture$Usage_DEFAULT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_COLOR_ATTACHMENT") {
        var ret = function Texture$Usage_COLOR_ATTACHMENT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_DEPTH_ATTACHMENT") {
        var ret = function Texture$Usage_DEPTH_ATTACHMENT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_STENCIL_ATTACHMENT") {
        var ret = function Texture$Usage_STENCIL_ATTACHMENT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_UPLOADABLE") {
        var ret = function Texture$Usage_UPLOADABLE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_SAMPLEABLE") {
        var ret = function Texture$Usage_SAMPLEABLE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Usage_SUBPASS_INPUT") {
        var ret = function Texture$Usage_SUBPASS_INPUT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$CubemapFace_POSITIVE_X") {
        var ret = function Texture$CubemapFace_POSITIVE_X() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$CubemapFace_NEGATIVE_X") {
        var ret = function Texture$CubemapFace_NEGATIVE_X() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$CubemapFace_POSITIVE_Y") {
        var ret = function Texture$CubemapFace_POSITIVE_Y() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$CubemapFace_NEGATIVE_Y") {
        var ret = function Texture$CubemapFace_NEGATIVE_Y() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$CubemapFace_POSITIVE_Z") {
        var ret = function Texture$CubemapFace_POSITIVE_Z() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$CubemapFace_NEGATIVE_Z") {
        var ret = function Texture$CubemapFace_NEGATIVE_Z() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$AttachmentPoint_COLOR0") {
        var ret = function RenderTarget$AttachmentPoint_COLOR0() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$AttachmentPoint_COLOR1") {
        var ret = function RenderTarget$AttachmentPoint_COLOR1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$AttachmentPoint_COLOR2") {
        var ret = function RenderTarget$AttachmentPoint_COLOR2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$AttachmentPoint_COLOR3") {
        var ret = function RenderTarget$AttachmentPoint_COLOR3() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$AttachmentPoint_COLOR") {
        var ret = function RenderTarget$AttachmentPoint_COLOR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$AttachmentPoint_DEPTH") {
        var ret = function RenderTarget$AttachmentPoint_DEPTH() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_R") {
        var ret = function PixelDataFormat_R() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_R_INTEGER") {
        var ret = function PixelDataFormat_R_INTEGER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_RG") {
        var ret = function PixelDataFormat_RG() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_RG_INTEGER") {
        var ret = function PixelDataFormat_RG_INTEGER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_RGB") {
        var ret = function PixelDataFormat_RGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_RGB_INTEGER") {
        var ret = function PixelDataFormat_RGB_INTEGER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_RGBA") {
        var ret = function PixelDataFormat_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_RGBA_INTEGER") {
        var ret = function PixelDataFormat_RGBA_INTEGER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_DEPTH_COMPONENT") {
        var ret = function PixelDataFormat_DEPTH_COMPONENT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_DEPTH_STENCIL") {
        var ret = function PixelDataFormat_DEPTH_STENCIL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataFormat_ALPHA") {
        var ret = function PixelDataFormat_ALPHA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_UBYTE") {
        var ret = function PixelDataType_UBYTE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_BYTE") {
        var ret = function PixelDataType_BYTE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_USHORT") {
        var ret = function PixelDataType_USHORT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_SHORT") {
        var ret = function PixelDataType_SHORT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_UINT") {
        var ret = function PixelDataType_UINT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_INT") {
        var ret = function PixelDataType_INT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_HALF") {
        var ret = function PixelDataType_HALF() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_FLOAT") {
        var ret = function PixelDataType_FLOAT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_UINT_10F_11F_11F_REV") {
        var ret = function PixelDataType_UINT_10F_11F_11F_REV() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "PixelDataType_USHORT_565") {
        var ret = function PixelDataType_USHORT_565() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_EAC_R11") {
        var ret = function CompressedPixelDataType_EAC_R11() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_EAC_R11_SIGNED") {
        var ret = function CompressedPixelDataType_EAC_R11_SIGNED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_EAC_RG11") {
        var ret = function CompressedPixelDataType_EAC_RG11() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_EAC_RG11_SIGNED") {
        var ret = function CompressedPixelDataType_EAC_RG11_SIGNED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_ETC2_RGB8") {
        var ret = function CompressedPixelDataType_ETC2_RGB8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_ETC2_SRGB8") {
        var ret = function CompressedPixelDataType_ETC2_SRGB8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_ETC2_RGB8_A1") {
        var ret = function CompressedPixelDataType_ETC2_RGB8_A1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_ETC2_SRGB8_A1") {
        var ret = function CompressedPixelDataType_ETC2_SRGB8_A1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_ETC2_EAC_RGBA8") {
        var ret = function CompressedPixelDataType_ETC2_EAC_RGBA8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_ETC2_EAC_SRGBA8") {
        var ret = function CompressedPixelDataType_ETC2_EAC_SRGBA8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT1_RGB") {
        var ret = function CompressedPixelDataType_DXT1_RGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT1_RGBA") {
        var ret = function CompressedPixelDataType_DXT1_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT3_RGBA") {
        var ret = function CompressedPixelDataType_DXT3_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT5_RGBA") {
        var ret = function CompressedPixelDataType_DXT5_RGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT1_SRGB") {
        var ret = function CompressedPixelDataType_DXT1_SRGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT1_SRGBA") {
        var ret = function CompressedPixelDataType_DXT1_SRGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT3_SRGBA") {
        var ret = function CompressedPixelDataType_DXT3_SRGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_DXT5_SRGBA") {
        var ret = function CompressedPixelDataType_DXT5_SRGBA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_4x4") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_4x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_5x4") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_5x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_5x5") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_5x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_6x5") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_6x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_6x6") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_6x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_8x5") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_8x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_8x6") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_8x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_8x8") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_8x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_10x5") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_10x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_10x6") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_10x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_10x8") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_10x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_10x10") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_10x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_12x10") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_12x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_RGBA_ASTC_12x12") {
        var ret = function CompressedPixelDataType_RGBA_ASTC_12x12() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_4x4") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_4x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_5x4") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_5x4() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_5x5") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_5x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_6x5") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_6x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_6x6") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_6x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_8x5") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_8x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_8x6") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_8x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_8x8") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_8x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x5") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x5() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x6") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x6() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x8") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x8() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x10") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_10x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_12x10") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_12x10() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompressedPixelDataType_SRGB8_ALPHA8_ASTC_12x12") {
        var ret = function CompressedPixelDataType_SRGB8_ALPHA8_ASTC_12x12() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "WrapMode_CLAMP_TO_EDGE") {
        var ret = function WrapMode_CLAMP_TO_EDGE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "WrapMode_REPEAT") {
        var ret = function WrapMode_REPEAT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "WrapMode_MIRRORED_REPEAT") {
        var ret = function WrapMode_MIRRORED_REPEAT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MinFilter_NEAREST") {
        var ret = function MinFilter_NEAREST() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MinFilter_LINEAR") {
        var ret = function MinFilter_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MinFilter_NEAREST_MIPMAP_NEAREST") {
        var ret = function MinFilter_NEAREST_MIPMAP_NEAREST() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MinFilter_LINEAR_MIPMAP_NEAREST") {
        var ret = function MinFilter_LINEAR_MIPMAP_NEAREST() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MinFilter_NEAREST_MIPMAP_LINEAR") {
        var ret = function MinFilter_NEAREST_MIPMAP_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MinFilter_LINEAR_MIPMAP_LINEAR") {
        var ret = function MinFilter_LINEAR_MIPMAP_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareMode_NONE") {
        var ret = function CompareMode_NONE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareMode_COMPARE_TO_TEXTURE") {
        var ret = function CompareMode_COMPARE_TO_TEXTURE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_LESS_EQUAL") {
        var ret = function CompareFunc_LESS_EQUAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_GREATER_EQUAL") {
        var ret = function CompareFunc_GREATER_EQUAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_LESS") {
        var ret = function CompareFunc_LESS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_GREATER") {
        var ret = function CompareFunc_GREATER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_EQUAL") {
        var ret = function CompareFunc_EQUAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_NOT_EQUAL") {
        var ret = function CompareFunc_NOT_EQUAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_ALWAYS") {
        var ret = function CompareFunc_ALWAYS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CompareFunc_NEVER") {
        var ret = function CompareFunc_NEVER() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MagFilter_NEAREST") {
        var ret = function MagFilter_NEAREST() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MagFilter_LINEAR") {
        var ret = function MagFilter_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CullingMode_NONE") {
        var ret = function CullingMode_NONE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CullingMode_FRONT") {
        var ret = function CullingMode_FRONT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CullingMode_BACK") {
        var ret = function CullingMode_BACK() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CullingMode_FRONT_AND_BACK") {
        var ret = function CullingMode_FRONT_AND_BACK() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "TransparencyMode_DEFAULT") {
        var ret = function TransparencyMode_DEFAULT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "TransparencyMode_TWO_PASSES_ONE_SIDE") {
        var ret = function TransparencyMode_TWO_PASSES_ONE_SIDE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "TransparencyMode_TWO_PASSES_TWO_SIDES") {
        var ret = function TransparencyMode_TWO_PASSES_TWO_SIDES() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "FeatureLevel_FEATURE_LEVEL_1") {
        var ret = function FeatureLevel_FEATURE_LEVEL_1() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "FeatureLevel_FEATURE_LEVEL_2") {
        var ret = function FeatureLevel_FEATURE_LEVEL_2() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_KEEP") {
        var ret = function StencilOperation_KEEP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_ZERO") {
        var ret = function StencilOperation_ZERO() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_REPLACE") {
        var ret = function StencilOperation_REPLACE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_INCR_CLAMP") {
        var ret = function StencilOperation_INCR_CLAMP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_INCR_WRAP") {
        var ret = function StencilOperation_INCR_WRAP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_DECR_CLAMP") {
        var ret = function StencilOperation_DECR_CLAMP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_DECR_WRAP") {
        var ret = function StencilOperation_DECR_WRAP() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilOperation_INVERT") {
        var ret = function StencilOperation_INVERT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilFace_FRONT") {
        var ret = function StencilFace_FRONT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilFace_BACK") {
        var ret = function StencilFace_BACK() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "StencilFace_FRONT_AND_BACK") {
        var ret = function StencilFace_FRONT_AND_BACK() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$TransferFunction_LINEAR") {
        var ret = function Ktx2Reader$TransferFunction_LINEAR() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$TransferFunction_sRGB") {
        var ret = function Ktx2Reader$TransferFunction_sRGB() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$Result_SUCCESS") {
        var ret = function Ktx2Reader$Result_SUCCESS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$Result_COMPRESSED_TRANSCODE_FAILURE") {
        var ret = function Ktx2Reader$Result_COMPRESSED_TRANSCODE_FAILURE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$Result_UNCOMPRESSED_TRANSCODE_FAILURE") {
        var ret = function Ktx2Reader$Result_UNCOMPRESSED_TRANSCODE_FAILURE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$Result_FORMAT_UNSUPPORTED") {
        var ret = function Ktx2Reader$Result_FORMAT_UNSUPPORTED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader$Result_FORMAT_ALREADY_REQUESTED") {
        var ret = function Ktx2Reader$Result_FORMAT_ALREADY_REQUESTED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$QualityLevel_LOW") {
        var ret = function View$QualityLevel_LOW() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$QualityLevel_MEDIUM") {
        var ret = function View$QualityLevel_MEDIUM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$QualityLevel_HIGH") {
        var ret = function View$QualityLevel_HIGH() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$QualityLevel_ULTRA") {
        var ret = function View$QualityLevel_ULTRA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$BlendMode_OPAQUE") {
        var ret = function View$BlendMode_OPAQUE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$BlendMode_TRANSLUCENT") {
        var ret = function View$BlendMode_TRANSLUCENT() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$BloomOptions$BlendMode_ADD") {
        var ret = function View$BloomOptions$BlendMode_ADD() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$BloomOptions$BlendMode_INTERPOLATE") {
        var ret = function View$BloomOptions$BlendMode_INTERPOLATE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$DepthOfFieldOptions$Filter_NONE") {
        var ret = function View$DepthOfFieldOptions$Filter_NONE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$DepthOfFieldOptions$Filter_UNUSED") {
        var ret = function View$DepthOfFieldOptions$Filter_UNUSED() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$DepthOfFieldOptions$Filter_MEDIAN") {
        var ret = function View$DepthOfFieldOptions$Filter_MEDIAN() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$AntiAliasing_NONE") {
        var ret = function View$AntiAliasing_NONE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$AntiAliasing_FXAA") {
        var ret = function View$AntiAliasing_FXAA() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$Dithering_NONE") {
        var ret = function View$Dithering_NONE() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$Dithering_TEMPORAL") {
        var ret = function View$Dithering_TEMPORAL() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$ShadowType_PCF") {
        var ret = function View$ShadowType_PCF() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$ShadowType_VSM") {
        var ret = function View$ShadowType_VSM() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$ShadowType_DPCF") {
        var ret = function View$ShadowType_DPCF() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View$ShadowType_PCSS") {
        var ret = function View$ShadowType_PCSS() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "EntityVector") {
        var ret = function EntityVector() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "AssetInstanceVector") {
        var ret = function AssetInstanceVector() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MaterialInstanceVector") {
        var ret = function MaterialInstanceVector() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Engine") {
        var ret = function Engine() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "SwapChain") {
        var ret = function SwapChain() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Renderer") {
        var ret = function Renderer() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "View") {
        var ret = function View() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Scene") {
        var ret = function Scene() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Frustum") {
        var ret = function Frustum() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Camera") {
        var ret = function Camera() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading") {
        var ret = function ColorGrading() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ColorGrading$Builder") {
        var ret = function ColorGrading$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget$Builder") {
        var ret = function RenderTarget$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderTarget") {
        var ret = function RenderTarget() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$Builder") {
        var ret = function RenderableManager$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager") {
        var ret = function RenderableManager() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "RenderableManager$Instance") {
        var ret = function RenderableManager$Instance() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "TransformManager") {
        var ret = function TransformManager() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "TransformManager$Instance") {
        var ret = function TransformManager$Instance() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Builder") {
        var ret = function LightManager$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager") {
        var ret = function LightManager() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "LightManager$Instance") {
        var ret = function LightManager$Instance() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "BufferObject$Builder") {
        var ret = function BufferObject$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "BufferObject") {
        var ret = function BufferObject() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer$Builder") {
        var ret = function VertexBuffer$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "VertexBuffer") {
        var ret = function VertexBuffer() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "IndexBuffer$Builder") {
        var ret = function IndexBuffer$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "IndexBuffer") {
        var ret = function IndexBuffer() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Material") {
        var ret = function Material() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MaterialInstance") {
        var ret = function MaterialInstance() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "TextureSampler") {
        var ret = function TextureSampler() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture") {
        var ret = function Texture() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Texture$Builder") {
        var ret = function Texture$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "IndirectLight") {
        var ret = function IndirectLight() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "IndirectLight$Builder") {
        var ret = function IndirectLight$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Skybox") {
        var ret = function Skybox() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Skybox$Builder") {
        var ret = function Skybox$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Entity") {
        var ret = function Entity() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "EntityManager") {
        var ret = function EntityManager() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "driver$BufferDescriptor") {
        var ret = function driver$BufferDescriptor() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "driver$PixelBufferDescriptor") {
        var ret = function driver$PixelBufferDescriptor() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx1Bundle") {
        var ret = function Ktx1Bundle() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Ktx2Reader") {
        var ret = function Ktx2Reader() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "KtxInfo") {
        var ret = function KtxInfo() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MeshReader$MaterialRegistry") {
        var ret = function MeshReader$MaterialRegistry() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MeshReader") {
        var ret = function MeshReader() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "MeshReader$Mesh") {
        var ret = function MeshReader$Mesh() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "DecodedImage") {
        var ret = function DecodedImage() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "SurfaceOrientation$Builder") {
        var ret = function SurfaceOrientation$Builder() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "SurfaceOrientation") {
        var ret = function SurfaceOrientation() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$Animator") {
        var ret = function gltfio$Animator() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$Avatar") {
        var ret = function gltfio$Avatar() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$FileLoader") {
        var ret = function gltfio$FileLoader() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$CTEngineAsset") {
        var ret = function gltfio$CTEngineAsset() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$CTEngineInstance") {
        var ret = function gltfio$CTEngineInstance() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$UbershaderProvider") {
        var ret = function gltfio$UbershaderProvider() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$StbProvider") {
        var ret = function gltfio$StbProvider() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$Ktx2Provider") {
        var ret = function gltfio$Ktx2Provider() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$AssetLoader") {
        var ret = function gltfio$AssetLoader() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "gltfio$ResourceLoader") {
        var ret = function gltfio$ResourceLoader() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CTAnimator") {
        var ret = function CTAnimator() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "CTScene") {
        var ret = function CTScene() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "Settings") {
        var ret = function Settings() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "JsonSerializer") {
        var ret = function JsonSerializer() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (name === "ViewerGui") {
        var ret = function ViewerGui() {
          "use strict";
          return body.apply(this, arguments);
        };
        return ret;
      } else if (humanName === "Engine._create") {
        return function anonymous(
          throwBindingError,
          invoker,
          fn,
          runDestructors,
          retType,
          classParam
        ) {
          return function Engine$getSupportedFeatureLevel() {
            if (arguments.length !== 0) {
              throwBindingError(
                "function Engine.getSupportedFeatureLevel called with " +
                  arguments.length +
                  " arguments, expected 0 args!"
              );
            }
            var thisWired = classParam.toWireType(null, this);
            var rv = invoker(fn, thisWired);
            var ret = retType.fromWireType(rv);
            return ret;
          };
        };
      } else {
        var ret = function Function(body) {
          "use strict";
          var b = body.apply(this, arguments);
          return b;
        };

        return ret;
      }
    }
    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, "", function (message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
          this.stack =
            this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };
      return errorClass;
    }
    var InternalError = undefined;
    function throwInternalError(message) {
      throw new InternalError(message);
    }
    function whenDependentTypesAreResolved(
      myTypes,
      dependentTypes,
      getTypeConverters
    ) {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach((dt, i) => {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(() => {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }
    function __embind_finalize_value_array(rawTupleType) {
      var reg = tupleRegistrations[rawTupleType];
      delete tupleRegistrations[rawTupleType];
      var elements = reg.elements;
      var elementsLength = elements.length;
      var elementTypes = elements
        .map(function (elt) {
          return elt.getterReturnType;
        })
        .concat(
          elements.map(function (elt) {
            return elt.setterArgumentType;
          })
        );
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      whenDependentTypesAreResolved(
        [rawTupleType],
        elementTypes,
        function (elementTypes) {
          elements.forEach((elt, i) => {
            var getterReturnType = elementTypes[i];
            var getter = elt.getter;
            var getterContext = elt.getterContext;
            var setterArgumentType = elementTypes[i + elementsLength];
            var setter = elt.setter;
            var setterContext = elt.setterContext;
            elt.read = (ptr) => {
              return getterReturnType["fromWireType"](
                getter(getterContext, ptr)
              );
            };
            elt.write = (ptr, o) => {
              var destructors = [];
              setter(
                setterContext,
                ptr,
                setterArgumentType["toWireType"](destructors, o)
              );
              runDestructors(destructors);
            };
          });
          return [
            {
              name: reg.name,
              fromWireType: function (ptr) {
                var rv = new Array(elementsLength);
                for (var i = 0; i < elementsLength; ++i) {
                  rv[i] = elements[i].read(ptr);
                }
                rawDestructor(ptr);
                return rv;
              },
              toWireType: function (destructors, o) {
                if (elementsLength !== o.length) {
                  throw new TypeError(
                    "Incorrect number of tuple elements for " +
                      reg.name +
                      ": expected=" +
                      elementsLength +
                      ", actual=" +
                      o.length
                  );
                }
                var ptr = rawConstructor();
                for (var i = 0; i < elementsLength; ++i) {
                  elements[i].write(ptr, o[i]);
                }
                if (destructors !== null) {
                  destructors.push(rawDestructor, ptr);
                }
                return ptr;
              },
              argPackAdvance: 8,
              readValueFromPointer: simpleReadValueFromPointer,
              destructorFunction: rawDestructor,
            },
          ];
        }
      );
    }
    var structRegistrations = {};
    function __embind_finalize_value_object(structType) {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords
        .map((field) => field.getterReturnType)
        .concat(fieldRecords.map((field) => field.setterArgumentType));
      whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes) => {
        var fields = {};
        fieldRecords.forEach((field, i) => {
          var fieldName = field.fieldName;
          var getterReturnType = fieldTypes[i];
          var getter = field.getter;
          var getterContext = field.getterContext;
          var setterArgumentType = fieldTypes[i + fieldRecords.length];
          var setter = field.setter;
          var setterContext = field.setterContext;
          fields[fieldName] = {
            read: (ptr) => {
              return getterReturnType["fromWireType"](
                getter(getterContext, ptr)
              );
            },
            write: (ptr, o) => {
              var destructors = [];
              setter(
                setterContext,
                ptr,
                setterArgumentType["toWireType"](destructors, o)
              );
              runDestructors(destructors);
            },
          };
        });
        return [
          {
            name: reg.name,
            fromWireType: function (ptr) {
              var rv = {};
              for (var i in fields) {
                rv[i] = fields[i].read(ptr);
              }
              rawDestructor(ptr);
              return rv;
            },
            toWireType: function (destructors, o) {
              for (var fieldName in fields) {
                if (!(fieldName in o)) {
                  throw new TypeError('Missing field:  "' + fieldName + '"');
                }
              }
              var ptr = rawConstructor();
              for (fieldName in fields) {
                fields[fieldName].write(ptr, o[fieldName]);
              }
              if (destructors !== null) {
                destructors.push(rawDestructor, ptr);
              }
              return ptr;
            },
            argPackAdvance: 8,
            readValueFromPointer: simpleReadValueFromPointer,
            destructorFunction: rawDestructor,
          },
        ];
      });
    }
    function __embind_register_bigint(
      primitiveType,
      name,
      size,
      minRange,
      maxRange
    ) {}
    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }
    function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }
    var embind_charCodes = undefined;
    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }
    var BindingError = undefined;
    function throwBindingError(message) {
      throw new BindingError(message);
    }
    function registerType(rawType, registeredInstance, options = {}) {
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        );
      }
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(
          'type "' + name + '" must have a positive integer typeid pointer'
        );
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach((cb) => cb());
      }
    }
    function __embind_register_bool(
      rawType,
      name,
      size,
      trueValue,
      falseValue
    ) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (wt) {
          return !!wt;
        },
        toWireType: function (destructors, o) {
          return o ? trueValue : falseValue;
        },
        argPackAdvance: 8,
        readValueFromPointer: function (pointer) {
          var heap;
          if (size === 1) {
            heap = HEAP8;
          } else if (size === 2) {
            heap = HEAP16;
          } else if (size === 4) {
            heap = HEAP32;
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }
          return this["fromWireType"](heap[pointer >> shift]);
        },
        destructorFunction: null,
      });
    }
    function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
        return false;
      }
      if (!(other instanceof ClassHandle)) {
        return false;
      }
      var leftClass = this.$$.ptrType.registeredClass;
      var left = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right = other.$$.ptr;
      while (leftClass.baseClass) {
        left = leftClass.upcast(left);
        leftClass = leftClass.baseClass;
      }
      while (rightClass.baseClass) {
        right = rightClass.upcast(right);
        rightClass = rightClass.baseClass;
      }
      return leftClass === rightClass && left === right;
    }
    function shallowCopyInternalPointer(o) {
      return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType,
      };
    }
    function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
    }
    var finalizationRegistry = false;
    function detachFinalizer(handle) {}
    function runDestructor($$) {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }
    function releaseClassHandle($$) {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
        runDestructor($$);
      }
    }
    function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (undefined === desiredClass.baseClass) {
        return null;
      }
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    }
    var registeredPointers = {};
    function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }
    function getLiveInheritedInstances() {
      var rv = [];
      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }
      return rv;
    }
    var deletionQueue = [];
    function flushPendingDeletes() {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]();
      }
    }
    var delayFunction = undefined;
    function setDelayFunction(fn) {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    }
    function init_embind() {
      Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
      Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
      Module["flushPendingDeletes"] = flushPendingDeletes;
      Module["setDelayFunction"] = setDelayFunction;
    }
    var registeredInstances = {};
    function getBasestPointer(class_, ptr) {
      if (ptr === undefined) {
        throwBindingError("ptr should not be undefined");
      }
      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }
      return ptr;
    }
    function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }
    function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType");
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified");
      }
      record.count = { value: 1 };
      return attachFinalizer(
        Object.create(prototype, { $$: { value: record } })
      );
    }
    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
      var registeredInstance = getInheritedInstance(
        this.registeredClass,
        rawPointer
      );
      if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance["clone"]();
        } else {
          var rv = registeredInstance["clone"]();
          this.destructor(ptr);
          return rv;
        }
      }
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr,
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr: ptr,
          });
        }
      }
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(
        rawPointer,
        this.registeredClass,
        toType.registeredClass
      );
      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr,
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
        });
      }
    }
    function attachFinalizer(handle) {
      if ("undefined" === typeof FinalizationRegistry) {
        attachFinalizer = (handle) => handle;
        return handle;
      }
      finalizationRegistry = new FinalizationRegistry((info) => {
        releaseClassHandle(info.$$);
      });
      attachFinalizer = (handle) => {
        var $$ = handle.$$;
        var hasSmartPtr = !!$$.smartPtr;
        if (hasSmartPtr) {
          var info = { $$: $$ };
          finalizationRegistry.register(handle, info, handle);
        }
        return handle;
      };
      detachFinalizer = (handle) => finalizationRegistry.unregister(handle);
      return attachFinalizer(handle);
    }
    function ClassHandle_clone() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this;
      } else {
        var clone = attachFinalizer(
          Object.create(Object.getPrototypeOf(this), {
            $$: { value: shallowCopyInternalPointer(this.$$) },
          })
        );
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone;
      }
    }
    function ClassHandle_delete() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }
      detachFinalizer(this);
      releaseClassHandle(this.$$);
      if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = undefined;
        this.$$.ptr = undefined;
      }
    }
    function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }
    function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }
      deletionQueue.push(this);
      if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
      this.$$.deleteScheduled = true;
      return this;
    }
    function init_ClassHandle() {
      ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
      ClassHandle.prototype["clone"] = ClassHandle_clone;
      ClassHandle.prototype["delete"] = ClassHandle_delete;
      ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
      ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
    }
    function ClassHandle() {}
    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function () {
          if (
            !proto[methodName].overloadTable.hasOwnProperty(arguments.length)
          ) {
            throwBindingError(
              "Function '" +
                humanName +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                proto[methodName].overloadTable +
                ")!"
            );
          }
          return proto[methodName].overloadTable[arguments.length].apply(
            this,
            arguments
          );
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }
    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable &&
            undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(
            "Cannot register multiple overloads of a function with the same number of arguments (" +
              numArguments +
              ")!"
          );
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }
    function RegisteredClass(
      name,
      constructor,
      instancePrototype,
      rawDestructor,
      baseClass,
      getActualType,
      upcast,
      downcast
    ) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
    function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(
            "Expected null or instance of " +
              desiredClass.name +
              ", got an instance of " +
              ptrClass.name
          );
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    }
    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError(
          'Cannot pass "' + embindRepr(handle) + '" as a ' + this.name
        );
      }
      if (!handle.$$.ptr) {
        throwBindingError(
          "Cannot pass deleted object as a pointer of type " + this.name
        );
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }
          return ptr;
        } else {
          return 0;
        }
      }
      if (!handle.$$) {
        throwBindingError(
          'Cannot pass "' + embindRepr(handle) + '" as a ' + this.name
        );
      }
      if (!handle.$$.ptr) {
        throwBindingError(
          "Cannot pass deleted object as a pointer of type " + this.name
        );
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError(
          "Cannot convert argument of type " +
            (handle.$$.smartPtrType
              ? handle.$$.smartPtrType.name
              : handle.$$.ptrType.name) +
            " to parameter type " +
            this.name
        );
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
          throwBindingError("Passing raw pointer to smart pointer is illegal");
        }
        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError(
                "Cannot convert argument of type " +
                  (handle.$$.smartPtrType
                    ? handle.$$.smartPtrType.name
                    : handle.$$.ptrType.name) +
                  " to parameter type " +
                  this.name
              );
            }
            break;
          case 1:
            ptr = handle.$$.smartPtr;
            break;
          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle["clone"]();
              ptr = this.rawShare(
                ptr,
                Emval.toHandle(function () {
                  clonedHandle["delete"]();
                })
              );
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;
          default:
            throwBindingError("Unsupporting sharing policy");
        }
      }
      return ptr;
    }
    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError(
          'Cannot pass "' + embindRepr(handle) + '" as a ' + this.name
        );
      }
      if (!handle.$$.ptr) {
        throwBindingError(
          "Cannot pass deleted object as a pointer of type " + this.name
        );
      }
      if (handle.$$.ptrType.isConst) {
        throwBindingError(
          "Cannot convert argument of type " +
            handle.$$.ptrType.name +
            " to parameter type " +
            this.name
        );
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr);
      }
      return ptr;
    }
    function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
        this.rawDestructor(ptr);
      }
    }
    function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
        handle["delete"]();
      }
    }
    function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype["argPackAdvance"] = 8;
      RegisteredPointer.prototype["readValueFromPointer"] =
        simpleReadValueFromPointer;
      RegisteredPointer.prototype["deleteObject"] =
        RegisteredPointer_deleteObject;
      RegisteredPointer.prototype["fromWireType"] =
        RegisteredPointer_fromWireType;
    }
    function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this["toWireType"] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this["toWireType"] = genericPointerToWireType;
      }
    }
    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }
      if (
        undefined !== Module[name].overloadTable &&
        undefined !== numArguments
      ) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }
    function dynCallLegacy(sig, ptr, args) {
      var f = Module["dynCall_" + sig];
      return args && args.length
        ? f.apply(null, [ptr].concat(args))
        : f.call(null, ptr);
    }
    function dynCall(sig, ptr, args) {
      if (sig.includes("j")) {
        return dynCallLegacy(sig, ptr, args);
      }
      var rtn = getWasmTableEntry(ptr).apply(null, args);
      return rtn;
    }
    function getDynCaller(sig, ptr) {
      var argCache = [];
      return function () {
        argCache.length = 0;
        Object.assign(argCache, arguments);
        return dynCall(sig, ptr, argCache);
      };
    }
    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        if (signature.includes("j")) {
          return getDynCaller(signature, rawFunction);
        }
        return getWasmTableEntry(rawFunction);
      }
      var fp = makeDynCaller();
      if (typeof fp != "function") {
        throwBindingError(
          "unknown function pointer with signature " +
            signature +
            ": " +
            rawFunction
        );
      }
      return fp;
    }
    var UnboundTypeError = undefined;
    function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }
    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(
        message + ": " + unboundTypes.map(getTypeName).join([", "])
      );
    }
    function __embind_register_class(
      rawType,
      rawPointerType,
      rawConstPointerType,
      baseClassRawType,
      getActualTypeSignature,
      getActualType,
      upcastSignature,
      upcast,
      downcastSignature,
      downcast,
      name,
      destructorSignature,
      rawDestructor
    ) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(
        getActualTypeSignature,
        getActualType
      );
      if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast);
      }
      if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast);
      }
      rawDestructor = embind__requireFunction(
        destructorSignature,
        rawDestructor
      );
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function () {
        throwUnboundTypeError(
          "Cannot construct " + name + " due to unbound types",
          [baseClassRawType]
        );
      });
      whenDependentTypesAreResolved(
        [rawType, rawPointerType, rawConstPointerType],
        baseClassRawType ? [baseClassRawType] : [],
        function (base) {
          base = base[0];
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          var constructor = createNamedFunction(
            legalFunctionName,
            "",
            function () {
              if (Object.getPrototypeOf(this) !== instancePrototype) {
                throw new BindingError("Use 'new' to construct " + name);
              }
              if (undefined === registeredClass.constructor_body) {
                throw new BindingError(name + " has no accessible constructor");
              }
              var body = registeredClass.constructor_body[arguments.length];
              if (undefined === body) {
                throw new BindingError(
                  "Tried to invoke ctor of " +
                    name +
                    " with invalid number of parameters (" +
                    arguments.length +
                    ") - expected (" +
                    Object.keys(registeredClass.constructor_body).toString() +
                    ") parameters instead!"
                );
              }
              return body.apply(this, arguments);
            }
          );
          var instancePrototype = Object.create(basePrototype, {
            constructor: { value: constructor },
          });
          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(
            name,
            constructor,
            instancePrototype,
            rawDestructor,
            baseClass,
            getActualType,
            upcast,
            downcast
          );
          var referenceConverter = new RegisteredPointer(
            name,
            registeredClass,
            true,
            false,
            false
          );
          var pointerConverter = new RegisteredPointer(
            name + "*",
            registeredClass,
            false,
            false,
            false
          );
          var constPointerConverter = new RegisteredPointer(
            name + " const*",
            registeredClass,
            false,
            true,
            false
          );
          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter,
          };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        }
      );
    }
    function new_(constructor, argumentList, humanName) {
      if (!(constructor instanceof Function)) {
        throw new TypeError(
          "new_ called with constructor type " +
            typeof constructor +
            " which is not a function"
        );
      }
      if (humanName === "applySettings") {
        var f = argumentList[argumentList.length - 1];
        var index = f.indexOf("applySettings");
        var end = f.indexOf(")");
        var instr = f.substr(index, end - index + 1);
        humanName = instr;
      }

      var dummy = createNamedFunction(
        constructor.name || "unknownFunctionName",
        humanName,
        function () {}
      );
      dummy.prototype.name = humanName;
      dummy.prototype = constructor.prototype;
      var ret = new dummy.prototype.constructor(...argumentList).__proto__;
      return dummy;
    }
    function craftInvokerFunction(
      humanName,
      argTypes,
      classType,
      cppInvokerFunc,
      cppTargetFunc
    ) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        );
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;
      for (var i = 1; i < argTypes.length; ++i) {
        if (
          argTypes[i] !== null &&
          argTypes[i].destructorFunction === undefined
        ) {
          needsDestructorStack = true;
          break;
        }
      }
      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";
      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }
      var invokerFnBody =
        "return function " +
        makeLegalFunctionName(humanName) +
        "(" +
        argsList +
        ") {\n" +
        "if (arguments.length !== " +
        (argCount - 2) +
        ") {\n" +
        "throwBindingError('function " +
        humanName +
        " called with ' + arguments.length + ' arguments, expected " +
        (argCount - 2) +
        " args!');\n" +
        "}\n";
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = [
        "throwBindingError",
        "invoker",
        "fn",
        "runDestructors",
        "retType",
        "classParam",
      ];
      var args2 = [
        throwBindingError,
        cppInvokerFunc,
        cppTargetFunc,
        runDestructors,
        argTypes[0],
        argTypes[1],
      ];
      if (isClassMethodFunc) {
        invokerFnBody +=
          "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }
      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody +=
          "var arg" +
          i +
          "Wired = argType" +
          i +
          ".toWireType(" +
          dtorStack +
          ", arg" +
          i +
          "); // " +
          argTypes[i + 2].name +
          "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }
      if (isClassMethodFunc) {
        argsListWired =
          "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
      invokerFnBody +=
        (returns ? "var rv = " : "") +
        "invoker(fn" +
        (argsListWired.length > 0 ? ", " : "") +
        argsListWired +
        ");\n";
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody +=
              paramName +
              "_dtor(" +
              paramName +
              "); // " +
              argTypes[i].name +
              "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }
      if (returns) {
        invokerFnBody +=
          "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
      } else {
      }
      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var res = new_(Function, args1, humanName);
      var invokerFunction = res.apply(null, args2);
      return invokerFunction;
    }
    function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(HEAPU32[(firstElement + i * 4) >> 2]);
      }
      return array;
    }
    function __embind_register_class_class_function(
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      rawInvoker,
      fn
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;
        function unboundTypesHandler() {
          throwUnboundTypeError(
            "Cannot call " + humanName + " due to unbound types",
            rawArgTypes
          );
        }

        if (methodName.startsWith("@@")) {
          methodName = Symbol[methodName.substring(2)];
        }
        var proto = classType.registeredClass.constructor;
        if (undefined === proto[methodName]) {
          //unboundTypesHandler.argCount=argCount-1;
          proto[methodName] = unboundTypesHandler;
          unboundTypesHandler.argCount = argCount - 1;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 1] = unboundTypesHandler;
        }
        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
          var func = craftInvokerFunction(
            humanName,
            invokerArgsArray,
            null,
            rawInvoker,
            fn
          );
          if (undefined === proto[methodName].overloadTable) {
            proto[methodName] = func;
            func.argCount = argCount - 1;
          } else {
            proto[methodName].overloadTable[argCount - 1] = func;
          }
          return [];
        });
        return [];
      });
    }
    function __embind_register_class_constructor(
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor
    ) {
      assert(argCount > 0);
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = "constructor " + classType.name;
        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (
          undefined !== classType.registeredClass.constructor_body[argCount - 1]
        ) {
          throw new BindingError(
            "Cannot register multiple constructors with identical number of parameters (" +
              (argCount - 1) +
              ") for class '" +
              classType.name +
              "'! Overload resolution is currently only performed using the parameter count, not actual type info!"
          );
        }
        classType.registeredClass.constructor_body[argCount - 1] = () => {
          throwUnboundTypeError(
            "Cannot construct " + classType.name + " due to unbound types",
            rawArgTypes
          );
        };
        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          argTypes.splice(1, 0, null);
          classType.registeredClass.constructor_body[argCount - 1] =
            craftInvokerFunction(
              humanName,
              argTypes,
              null,
              invoker,
              rawConstructor
            );
          return [];
        });
        return [];
      });
    }
    function __embind_register_class_function(
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      rawInvoker,
      context,
      isPureVirtual
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;
        if (methodName.startsWith("@@")) {
          methodName = Symbol[methodName.substring(2)];
        }
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
        function unboundTypesHandler() {
          throwUnboundTypeError(
            "Cannot call " + humanName + " due to unbound types",
            rawArgTypes
          );
        }
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (
          undefined === method ||
          (undefined === method.overloadTable &&
            method.className !== classType.name &&
            method.argCount === argCount - 2)
        ) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
        whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
          var memberFunction = craftInvokerFunction(
            humanName,
            argTypes,
            classType,
            rawInvoker,
            context
          );
          if (undefined === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }
          return [];
        });
        return [];
      });
    }
    function validateThis(this_, classType, humanName) {
      if (!(this_ instanceof Object)) {
        throwBindingError(humanName + ' with invalid "this": ' + this_);
      }
      if (!(this_ instanceof classType.registeredClass.constructor)) {
        throwBindingError(
          humanName +
            ' incompatible with "this" of type ' +
            this_.constructor.name
        );
      }
      if (!this_.$$.ptr) {
        throwBindingError(
          "cannot call emscripten binding method " +
            humanName +
            " on deleted object"
        );
      }
      return upcastPointer(
        this_.$$.ptr,
        this_.$$.ptrType.registeredClass,
        classType.registeredClass
      );
    }
    function __embind_register_class_property(
      classType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext
    ) {
      fieldName = readLatin1String(fieldName);
      getter = embind__requireFunction(getterSignature, getter);
      whenDependentTypesAreResolved([], [classType], function (classType) {
        classType = classType[0];
        var humanName = classType.name + "." + fieldName;
        var desc = {
          get: function () {
            throwUnboundTypeError(
              "Cannot access " + humanName + " due to unbound types",
              [getterReturnType, setterArgumentType]
            );
          },
          enumerable: true,
          configurable: true,
        };
        if (setter) {
          desc.set = () => {
            throwUnboundTypeError(
              "Cannot access " + humanName + " due to unbound types",
              [getterReturnType, setterArgumentType]
            );
          };
        } else {
          desc.set = (v) => {
            throwBindingError(humanName + " is a read-only property");
          };
        }
        Object.defineProperty(
          classType.registeredClass.instancePrototype,
          fieldName,
          desc
        );
        whenDependentTypesAreResolved(
          [],
          setter ? [getterReturnType, setterArgumentType] : [getterReturnType],
          function (types) {
            var getterReturnType = types[0];
            var desc = {
              get: function () {
                var ptr = validateThis(this, classType, humanName + " getter");
                return getterReturnType["fromWireType"](
                  getter(getterContext, ptr)
                );
              },
              enumerable: true,
            };
            if (setter) {
              setter = embind__requireFunction(setterSignature, setter);
              var setterArgumentType = types[1];
              desc.set = function (v) {
                var ptr = validateThis(this, classType, humanName + " setter");
                var destructors = [];
                setter(
                  setterContext,
                  ptr,
                  setterArgumentType["toWireType"](destructors, v)
                );
                runDestructors(destructors);
              };
            }
            Object.defineProperty(
              classType.registeredClass.instancePrototype,
              fieldName,
              desc
            );
            return [];
          }
        );
        return [];
      });
    }
    var emval_free_list = [];
    var emval_handle_array = [
      {},
      { value: undefined },
      { value: null },
      { value: true },
      { value: false },
    ];
    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
      }
    }
    function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count;
        }
      }
      return count;
    }
    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i];
        }
      }
      return null;
    }
    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }
    var Emval = {
      toValue: (handle) => {
        if (!handle) {
          throwBindingError("Cannot use deleted val. handle = " + handle);
        }
        return emval_handle_array[handle].value;
      },
      toHandle: (value) => {
        switch (value) {
          case undefined:
            return 1;
          case null:
            return 2;
          case true:
            return 3;
          case false:
            return 4;
          default: {
            var handle = emval_free_list.length
              ? emval_free_list.pop()
              : emval_handle_array.length;
            emval_handle_array[handle] = { refcount: 1, value: value };
            return handle;
          }
        }
      },
    };
    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (handle) {
          var rv = Emval.toValue(handle);
          __emval_decref(handle);
          return rv;
        },
        toWireType: function (destructors, value) {
          return Emval.toHandle(value);
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: null,
      });
    }
    function enumReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return function (pointer) {
            var heap = signed ? HEAP8 : HEAPU8;
            return this["fromWireType"](heap[pointer]);
          };
        case 1:
          return function (pointer) {
            var heap = signed ? HEAP16 : HEAPU16;
            return this["fromWireType"](heap[pointer >> 1]);
          };
        case 2:
          return function (pointer) {
            var heap = signed ? HEAP32 : HEAPU32;
            return this["fromWireType"](heap[pointer >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_enum(rawType, name, size, isSigned) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      function ctor() {}
      ctor.values = {};
      registerType(rawType, {
        name: name,
        constructor: ctor,
        fromWireType: function (c) {
          return this.constructor.values[c];
        },
        toWireType: function (destructors, c) {
          return c.value;
        },
        argPackAdvance: 8,
        readValueFromPointer: enumReadValueFromPointer(name, shift, isSigned),
        destructorFunction: null,
      });
      exposePublicSymbol(name, ctor);
    }
    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(
          humanName + " has unknown type " + getTypeName(rawType)
        );
      }
      return impl;
    }
    function __embind_register_enum_value(rawEnumType, name, enumValue) {
      var enumType = requireRegisteredType(rawEnumType, "enum");
      name = readLatin1String(name);
      var Enum = enumType.constructor;
      var Value = Object.create(enumType.constructor.prototype, {
        value: { value: enumValue },
        constructor: {
          value: createNamedFunction(
            enumType.name + "_" + name,
            "",
            function () {}
          ),
        },
      });
      Enum.values[enumValue] = Value;
      Enum[name] = Value;
    }
    function embindRepr(v) {
      if (v === null) {
        return "null";
      }
      var t = typeof v;
      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    }
    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function (pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };
        case 3:
          return function (pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }
    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          return value;
        },
        toWireType: function (destructors, value) {
          return value;
        },
        argPackAdvance: 8,
        readValueFromPointer: floatReadValueFromPointer(name, shift),
        destructorFunction: null,
      });
    }
    function __embind_register_function(
      name,
      argCount,
      rawArgTypesAddr,
      signature,
      rawInvoker,
      fn
    ) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(
        name,
        function () {
          throwUnboundTypeError(
            "Cannot call " + name + " due to unbound types",
            argTypes
          );
        },
        argCount - 1
      );
      whenDependentTypesAreResolved([], argTypes, function (argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn),
          argCount - 1
        );
        return [];
      });
    }
    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed
            ? function readS8FromPointer(pointer) {
                return HEAP8[pointer];
              }
            : function readU8FromPointer(pointer) {
                return HEAPU8[pointer];
              };
        case 1:
          return signed
            ? function readS16FromPointer(pointer) {
                return HEAP16[pointer >> 1];
              }
            : function readU16FromPointer(pointer) {
                return HEAPU16[pointer >> 1];
              };
        case 2:
          return signed
            ? function readS32FromPointer(pointer) {
                return HEAP32[pointer >> 2];
              }
            : function readU32FromPointer(pointer) {
                return HEAPU32[pointer >> 2];
              };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_integer(
      primitiveType,
      name,
      size,
      minRange,
      maxRange
    ) {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var shift = getShiftFromSize(size);
      var fromWireType = (value) => value;
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = (value) => (value << bitshift) >>> bitshift;
      }
      var isUnsignedType = name.includes("unsigned");
      var checkAssertions = (value, toTypeName) => {};
      var toWireType;
      if (isUnsignedType) {
        toWireType = function (destructors, value) {
          checkAssertions(value, this.name);
          return value >>> 0;
        };
      } else {
        toWireType = function (destructors, value) {
          checkAssertions(value, this.name);
          return value;
        };
      }
      registerType(primitiveType, {
        name: name,
        fromWireType: fromWireType,
        toWireType: toWireType,
        argPackAdvance: 8,
        readValueFromPointer: integerReadValueFromPointer(
          name,
          shift,
          minRange !== 0
        ),
        destructorFunction: null,
      });
    }
    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(buffer, data, size);
      }
      name = readLatin1String(name);
      registerType(
        rawType,
        {
          name: name,
          fromWireType: decodeMemoryView,
          argPackAdvance: 8,
          readValueFromPointer: decodeMemoryView,
        },
        { ignoreDuplicateRegistrations: true }
      );
    }
    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = HEAPU32[value >> 2];
          var payload = value + 4;
          var str;
          if (stdStringIsUTF8) {
            var decodeStartPtr = payload;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = payload + i;
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            var a = new Array(length);
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[payload + i]);
            }
            str = a.join("");
          }
          _free(value);
          return str;
        },
        toWireType: function (destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          var length;
          var valueIsOfTypeString = typeof value == "string";
          if (
            !(
              valueIsOfTypeString ||
              value instanceof Uint8Array ||
              value instanceof Uint8ClampedArray ||
              value instanceof Int8Array
            )
          ) {
            throwBindingError("Cannot pass non-string to std::string");
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            length = lengthBytesUTF8(value);
          } else {
            length = value.length;
          }
          var base = _malloc(4 + length + 1);
          var ptr = base + 4;
          HEAPU32[base >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(ptr);
                  throwBindingError(
                    "String has UTF-16 code units that do not fit in 8 bits"
                  );
                }
                HEAPU8[ptr + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + i] = value[i];
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, base);
          }
          return base;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        },
      });
    }
    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = () => HEAPU16;
        shift = 1;
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = () => HEAPU32;
        shift = 2;
      }
      registerType(rawType, {
        name: name,
        fromWireType: function (value) {
          var length = HEAPU32[value >> 2];
          var HEAP = getHeap();
          var str;
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
          _free(value);
          return str;
        },
        toWireType: function (destructors, value) {
          if (!(typeof value == "string")) {
            throwBindingError(
              "Cannot pass non-string to C++ string type " + name
            );
          }
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          HEAPU32[ptr >> 2] = length >> shift;
          encodeString(value, ptr + 4, length + charSize);
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function (ptr) {
          _free(ptr);
        },
      });
    }
    function __embind_register_value_array(
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor
    ) {
      tupleRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(
          constructorSignature,
          rawConstructor
        ),
        rawDestructor: embind__requireFunction(
          destructorSignature,
          rawDestructor
        ),
        elements: [],
      };
    }
    function __embind_register_value_array_element(
      rawTupleType,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext
    ) {
      tupleRegistrations[rawTupleType].elements.push({
        getterReturnType: getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext: getterContext,
        setterArgumentType: setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext: setterContext,
      });
    }
    function __embind_register_value_object(
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor
    ) {
      structRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(
          constructorSignature,
          rawConstructor
        ),
        rawDestructor: embind__requireFunction(
          destructorSignature,
          rawDestructor
        ),
        fields: [],
      };
    }
    function __embind_register_value_object_field(
      structType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext
    ) {
      structRegistrations[structType].fields.push({
        fieldName: readLatin1String(fieldName),
        getterReturnType: getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext: getterContext,
        setterArgumentType: setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext: setterContext,
      });
    }
    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name: name,
        argPackAdvance: 0,
        fromWireType: function () {
          return undefined;
        },
        toWireType: function (destructors, o) {
          return undefined;
        },
      });
    }
    function __emscripten_date_now() {
      return Date.now();
    }
    var nowIsMonotonic = true;
    function __emscripten_get_now_is_monotonic() {
      return nowIsMonotonic;
    }
    function __emscripten_throw_longjmp() {
      throw Infinity;
    }
    function __emval_as(handle, returnType, destructorsRef) {
      handle = Emval.toValue(handle);
      returnType = requireRegisteredType(returnType, "emval::as");
      var destructors = [];
      var rd = Emval.toHandle(destructors);
      HEAPU32[destructorsRef >> 2] = rd;
      return returnType["toWireType"](destructors, handle);
    }
    function __emval_get_property(handle, key) {
      handle = Emval.toValue(handle);
      key = Emval.toValue(key);
      return Emval.toHandle(handle[key]);
    }
    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }
    var emval_symbols = {};
    function getStringOrSymbol(address) {
      var symbol = emval_symbols[address];
      if (symbol === undefined) {
        return readLatin1String(address);
      }
      return symbol;
    }
    function __emval_new_cstring(v) {
      return Emval.toHandle(getStringOrSymbol(v));
    }
    function __emval_run_destructors(handle) {
      var destructors = Emval.toValue(handle);
      runDestructors(destructors);
      __emval_decref(handle);
    }
    function __emval_take_value(type, arg) {
      type = requireRegisteredType(type, "_emval_take_value");
      var v = type["readValueFromPointer"](arg);
      return Emval.toHandle(v);
    }
    function __munmap_js(addr, len, prot, flags, fd, offset) {
      try {
        var stream = FS.getStream(fd);
        if (stream) {
          if (prot & 2) {
            SYSCALLS.doMsync(addr, stream, len, flags, offset);
          }
          FS.munmap(stream);
        }
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return -e.errno;
      }
    }
    function _abort() {
      abort("");
    }
    var readAsmConstArgsArray = [];
    function readAsmConstArgs(sigPtr, buf) {
      readAsmConstArgsArray.length = 0;
      var ch;
      buf >>= 2;
      while ((ch = HEAPU8[sigPtr++])) {
        buf += (ch != 105) & buf;
        readAsmConstArgsArray.push(
          ch == 105 ? HEAP32[buf] : HEAPF64[buf++ >> 1]
        );
        ++buf;
      }
      return readAsmConstArgsArray;
    }
    function _emscripten_asm_const_int(code, sigPtr, argbuf) {
      var args = readAsmConstArgs(sigPtr, argbuf);
      //console.log(code);
      return ASM_CONSTS[code].apply(null, args);
    }
    function getHeapMax() {
      return 2147483648;
    }
    function _emscripten_get_heap_max() {
      return getHeapMax();
    }
    var _emscripten_get_now;
    if (ENVIRONMENT_IS_NODE) {
      _emscripten_get_now = () => {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6;
      };
    } else _emscripten_get_now = () => performance.now();
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      let alignUp = (x, multiple) =>
        x + ((multiple - (x % multiple)) % multiple);
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(
          overGrownHeapSize,
          requestedSize + 100663296
        );
        var newSize = Math.min(
          maxHeapSize,
          alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
        );
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    var WS = { sockets: [null], socketEvent: null };
    function _emscripten_websocket_close(socketId, code, reason) {
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
      var reasonStr = reason ? UTF8ToString(reason) : undefined;
      if (reason) socket.close(code || undefined, UTF8ToString(reason));
      else if (code) socket.close(code);
      else socket.close();
      return 0;
    }
    function _emscripten_websocket_delete(socketId) {
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
      socket.onOpen = socket.onError = socket.onClose = socket.onMessage = null;
      delete WS.sockets[socketId];
      // wx.onSocketMessage((message)=>{});
      // wx.onSocketOpen(() =>{});
      return 0;
    }
    function _emscripten_websocket_is_supported() {
      return true;
      //return typeof WebSocket != "undefined";
    }
    function _emscripten_websocket_new(createAttributes) {
    //   if (typeof WebSocket == "undefined") {
    //     return -1;
    //   }
      if (!createAttributes) {
        return -5;
      }
      var createAttrs = createAttributes >> 2;
      var url = UTF8ToString(HEAP32[createAttrs]);
      var protocols = HEAP32[createAttrs + 1];
    //   var socket = protocols
    //     ? new WebSocket(url, UTF8ToString(protocols).split(","))
    //     : new WebSocket(url);
      
    //   socket.binaryType = "arraybuffer";

      var socket = wx.connectSocket({
          url: url,
        })
      var socketId = WS.sockets.length;
      WS.sockets[socketId] = socket;
      return socketId;
    }
    function _emscripten_websocket_send_utf8_text(socketId, textData) {
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
      var str = UTF8ToString(textData);

      // socket.send(str);
      
      // wx.sendSocketMessage({
      //   // data: "{\"name\":\"" + wx.getStorageSync('openid') + "\"}"  
      //   data: str
      // });

      socket.send({
        data: str,
        success: function (res) {
          console.log("sendSuccess", res)
        },
        fail: function (res) {
          console.error("sendFailed", res)
        }
      })
      return 0;
    }
    function _emscripten_websocket_set_onmessage_callback_on_thread(
      socketId,
      userData,
      callbackFunc,
      thread
    ) {
      if (!WS.socketEvent) WS.socketEvent = _malloc(1024);
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
    socket.onMessage(message => {
        HEAPU32[WS.socketEvent >> 2] = socketId;
        if (typeof message.data == "string") {
          var len = lengthBytesUTF8(message.data) + 1;
          var buf = _malloc(len);
          stringToUTF8(message.data, buf, len);
          HEAPU32[(WS.socketEvent + 12) >> 2] = 1;
        } else {
          var len = message.data.byteLength;
          var buf = _malloc(len);
          HEAP8.set(new Uint8Array(message.data), buf);
          HEAPU32[(WS.socketEvent + 12) >> 2] = 0;
        }
        HEAPU32[(WS.socketEvent + 4) >> 2] = buf;
        HEAPU32[(WS.socketEvent + 8) >> 2] = len;
        getWasmTableEntry(callbackFunc)(0, WS.socketEvent, userData);
        _free(buf);
      });
      return 0;
    }
    function _emscripten_websocket_set_onopen_callback_on_thread(
      socketId,
      userData,
      callbackFunc,
      thread
    ) {
      if (!WS.socketEvent) WS.socketEvent = _malloc(1024);
      let str = UTF8ToString(userData);
      var socket = WS.sockets[socketId];
      if (!socket) {
        return -3;
      }
      socket.onOpen(function(res){
        HEAPU32[WS.socketEvent >> 2] = socketId;
        getWasmTableEntry(callbackFunc)(0, WS.socketEvent, userData);
      });
      return 0;
    }
    var ENV = {};
    function getExecutableName() {
      return thisProgram || "./this.program";
    }
    function getEnvStrings() {
      if (!getEnvStrings.strings) {
        var lang =
          (
            (typeof navigator == "object" &&
              navigator.languages &&
              navigator.languages[0]) ||
            "C"
          ).replace("-", "_") + ".UTF-8";
        var env = {
          USER: "web_user",
          LOGNAME: "web_user",
          PATH: "/",
          PWD: "/",
          HOME: "/home/web_user",
          LANG: lang,
          _: getExecutableName(),
        };
        for (var x in ENV) {
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + "=" + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }
    function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function (string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(__environ + i * 4) >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }
    function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach(function (string) {
        bufSize += string.length + 1;
      });
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    }
    function _exit(status) {
      exit(status);
    }
    function _fd_close(fd) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno;
      }
    }
    function doReadv(stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
      }
      return ret;
    }
    function _fd_read(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno;
      }
    }
    function convertI32PairToI53Checked(lo, hi) {
      return (hi + 2097152) >>> 0 < 4194305 - !!lo
        ? (lo >>> 0) + hi * 4294967296
        : NaN;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      try {
        var offset = convertI32PairToI53Checked(offset_low, offset_high);
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.llseek(stream, offset, whence);
        (tempI64 = [
          stream.position >>> 0,
          ((tempDouble = stream.position),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) |
                  0) >>>
                0
              : ~~+Math.ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[newOffset >> 2] = tempI64[0]),
          (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
        if (stream.getdents && offset === 0 && whence === 0)
          stream.getdents = null;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno;
      }
    }
    function doWritev(stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
      }
      return ret;
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt);
        HEAPU32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
        return e.errno;
      }
    }
    function _getTempRet0() {
      return getTempRet0();
    }
    function _getentropy(buffer, size) {
      if (!_getentropy.randomDevice) {
        _getentropy.randomDevice = getRandomDevice();
      }
      for (var i = 0; i < size; i++) {
        HEAP8[(buffer + i) >> 0] = _getentropy.randomDevice();
      }
      return 0;
    }
    function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(
      ctx
    ) {
      return !!(ctx.dibvbi = ctx.getExtension(
        "WEBGL_draw_instanced_base_vertex_base_instance"
      ));
    }
    function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
      ctx
    ) {
      return !!(ctx.mdibvbi = ctx.getExtension(
        "WEBGL_multi_draw_instanced_base_vertex_base_instance"
      ));
    }
    function __webgl_enable_WEBGL_multi_draw(ctx) {
      return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
    }
    var GL = {
      counter: 1,
      buffers: [],
      mappedBuffers: {},
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      textures: [],
      shaders: [],
      vaos: [],
      contexts: [],
      offscreenCanvases: {},
      queries: [],
      samplers: [],
      transformFeedbacks: [],
      syncs: [],
      byteSizeByTypeRoot: 5120,
      byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
      stringCache: {},
      stringiCache: {},
      unpackAlignment: 4,
      recordError: function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
      getNewId: function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
      MAX_TEMP_BUFFER_SIZE: 2097152,
      numTempVertexBuffersPerSize: 64,
      log2ceilLookup: function (i) {
        return 32 - Math.clz32(i === 0 ? 0 : i - 1);
      },
      generateTempBuffers: function (quads, context) {
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        context.tempVertexBufferCounters1 = [];
        context.tempVertexBufferCounters2 = [];
        context.tempVertexBufferCounters1.length =
          context.tempVertexBufferCounters2.length = largestIndex + 1;
        context.tempVertexBuffers1 = [];
        context.tempVertexBuffers2 = [];
        context.tempVertexBuffers1.length = context.tempVertexBuffers2.length =
          largestIndex + 1;
        context.tempIndexBuffers = [];
        context.tempIndexBuffers.length = largestIndex + 1;
        for (var i = 0; i <= largestIndex; ++i) {
          context.tempIndexBuffers[i] = null;
          context.tempVertexBufferCounters1[i] =
            context.tempVertexBufferCounters2[i] = 0;
          var ringbufferLength = GL.numTempVertexBuffersPerSize;
          context.tempVertexBuffers1[i] = [];
          context.tempVertexBuffers2[i] = [];
          var ringbuffer1 = context.tempVertexBuffers1[i];
          var ringbuffer2 = context.tempVertexBuffers2[i];
          ringbuffer1.length = ringbuffer2.length = ringbufferLength;
          for (var j = 0; j < ringbufferLength; ++j) {
            ringbuffer1[j] = ringbuffer2[j] = null;
          }
        }
        if (quads) {
          context.tempQuadIndexBuffer = GLctx.createBuffer();
          context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
          var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
          var quadIndexes = new Uint16Array(numIndexes);
          var i = 0,
            v = 0;
          while (1) {
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 1;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 3;
            if (i >= numIndexes) break;
            v += 4;
          }
          context.GLctx.bufferData(34963, quadIndexes, 35044);
          context.GLctx.bindBuffer(34963, null);
        }
      },
      getTempVertexBuffer: function getTempVertexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
        var nextFreeBufferIndex =
          GL.currentContext.tempVertexBufferCounters1[idx];
        GL.currentContext.tempVertexBufferCounters1[idx] =
          (GL.currentContext.tempVertexBufferCounters1[idx] + 1) &
          (GL.numTempVertexBuffersPerSize - 1);
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
          return vbo;
        }
        var prevVBO = GLctx.getParameter(34964);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(34962, 1 << idx, 35048);
        GLctx.bindBuffer(34962, prevVBO);
        return ringbuffer[nextFreeBufferIndex];
      },
      getTempIndexBuffer: function getTempIndexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ibo = GL.currentContext.tempIndexBuffers[idx];
        if (ibo) {
          return ibo;
        }
        var prevIBO = GLctx.getParameter(34965);
        GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
        GLctx.bufferData(34963, 1 << idx, 35048);
        GLctx.bindBuffer(34963, prevIBO);
        return GL.currentContext.tempIndexBuffers[idx];
      },
      newRenderingFrameStarted: function newRenderingFrameStarted() {
        if (!GL.currentContext) {
          return;
        }
        var vb = GL.currentContext.tempVertexBuffers1;
        GL.currentContext.tempVertexBuffers1 =
          GL.currentContext.tempVertexBuffers2;
        GL.currentContext.tempVertexBuffers2 = vb;
        vb = GL.currentContext.tempVertexBufferCounters1;
        GL.currentContext.tempVertexBufferCounters1 =
          GL.currentContext.tempVertexBufferCounters2;
        GL.currentContext.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        for (var i = 0; i <= largestIndex; ++i) {
          GL.currentContext.tempVertexBufferCounters1[i] = 0;
        }
      },
      getSource: function (shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAP32[(length + i * 4) >> 2] : -1;
          source += UTF8ToString(
            HEAP32[(string + i * 4) >> 2],
            len < 0 ? undefined : len
          );
        }
        return source;
      },
      calcBufLength: function calcBufLength(size, type, stride, count) {
        if (stride > 0) {
          return count * stride;
        }
        var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
        return size * typeSize * count;
      },
      usedTempBuffers: [],
      preDrawHandleClientVertexAttribBindings:
        function preDrawHandleClientVertexAttribBindings(count) {
          GL.resetBufferBinding = false;
          for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
            var cb = GL.currentContext.clientBuffers[i];
            if (!cb.clientside || !cb.enabled) continue;
            GL.resetBufferBinding = true;
            var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
            var buf = GL.getTempVertexBuffer(size);
            GLctx.bindBuffer(34962, buf);
            GLctx.bufferSubData(
              34962,
              0,
              HEAPU8.subarray(cb.ptr, cb.ptr + size)
            );
            cb.vertexAttribPointerAdaptor.call(
              GLctx,
              i,
              cb.size,
              cb.type,
              cb.normalized,
              cb.stride,
              0
            );
          }
        },
      postDrawHandleClientVertexAttribBindings:
        function postDrawHandleClientVertexAttribBindings() {
          if (GL.resetBufferBinding) {
            GLctx.bindBuffer(
              34962,
              GL.buffers[GLctx.currentArrayBufferBinding]
            );
          }
        },
      createContext: function (canvas, webGLContextAttributes) {
        if (!canvas.getContextSafariWebGL2Fixed) {
          canvas.getContextSafariWebGL2Fixed = canvas.getContext;
          function fixedGetContext(ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return (ver == "webgl") == gl instanceof WebGLRenderingContext
              ? gl
              : null;
          }
          canvas.getContext = fixedGetContext;
        }
        var ctx = canvas.getContext("webgl2", webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle;
      },
      registerContext: function (ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx,
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (
          typeof webGLContextAttributes.enableExtensionsByDefault ==
            "undefined" ||
          webGLContextAttributes.enableExtensionsByDefault
        ) {
          GL.initExtensions(context);
        }
        context.maxVertexAttribs = context.GLctx.getParameter(34921);
        context.clientBuffers = [];
        for (var i = 0; i < context.maxVertexAttribs; i++) {
          context.clientBuffers[i] = {
            enabled: false,
            clientside: false,
            size: 0,
            type: 0,
            normalized: 0,
            stride: 0,
            ptr: 0,
            vertexAttribPointerAdaptor: null,
          };
        }
        GL.generateTempBuffers(false, context);
        return handle;
      },
      makeContextCurrent: function (contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx);
      },
      getContext: function (contextHandle) {
        return GL.contexts[contextHandle];
      },
      deleteContext: function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle])
          GL.currentContext = null;
        if (typeof JSEvents == "object")
          JSEvents.removeAllHandlersOnTarget(
            GL.contexts[contextHandle].GLctx.canvas
          );
        if (
          GL.contexts[contextHandle] &&
          GL.contexts[contextHandle].GLctx.canvas
        )
          GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        GL.contexts[contextHandle] = null;
      },
      initExtensions: function (context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(
          GLctx
        );
        if (context.version >= 2) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension(
            "EXT_disjoint_timer_query_webgl2"
          );
        }
        if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension(
            "EXT_disjoint_timer_query"
          );
        }
        __webgl_enable_WEBGL_multi_draw(GLctx);
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function (ext) {
          if (!ext.includes("lose_context") && !ext.includes("debug")) {
            GLctx.getExtension(ext);
          }
        });
      },
    };
    function _glActiveTexture(x0) {
      GLctx["activeTexture"](x0);
    }
    function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    }
    function _glBeginQuery(target, id) {
      GLctx["beginQuery"](target, GL.queries[id]);
    }
    function _glBindBuffer(target, buffer) {
      if (target == 34962) {
        GLctx.currentArrayBufferBinding = buffer;
      } else if (target == 34963) {
        GLctx.currentElementArrayBufferBinding = buffer;
      }
      if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer;
      } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer;
      }
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    }
    function _glBindBufferBase(target, index, buffer) {
      GLctx["bindBufferBase"](target, index, GL.buffers[buffer]);
    }
    function _glBindBufferRange(target, index, buffer, offset, ptrsize) {
      GLctx["bindBufferRange"](
        target,
        index,
        GL.buffers[buffer],
        offset,
        ptrsize
      );
    }
    function _glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
    }
    function _glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    }
    function _glBindSampler(unit, sampler) {
      GLctx["bindSampler"](unit, GL.samplers[sampler]);
    }
    function _glBindTexture(target, texture) {
      GLctx.bindTexture(target, GL.textures[texture]);
    }
    function _glBindVertexArray(vao) {
      GLctx["bindVertexArray"](GL.vaos[vao]);
      var ibo = GLctx.getParameter(34965);
      GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0;
    }
    function _glBlendEquationSeparate(x0, x1) {
      GLctx["blendEquationSeparate"](x0, x1);
    }
    function _glBlendFuncSeparate(x0, x1, x2, x3) {
      GLctx["blendFuncSeparate"](x0, x1, x2, x3);
    }
    function _glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
      GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
    }
    function _glBufferData(target, size, data, usage) {
      if (true) {
        if (data && size) {
          GLctx.bufferData(target, HEAPU8, usage, data, size);
        } else {
          GLctx.bufferData(target, size, usage);
        }
      } else {
        GLctx.bufferData(
          target,
          data ? HEAPU8.subarray(data, data + size) : size,
          usage
        );
      }
    }
    function _glBufferSubData(target, offset, size, data) {
      if (true) {
        size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return;
      }
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
    }
    function _glClearBufferfi(x0, x1, x2, x3) {
      GLctx["clearBufferfi"](x0, x1, x2, x3);
    }
    function _glClearBufferfv(buffer, drawbuffer, value) {
      GLctx["clearBufferfv"](buffer, drawbuffer, HEAPF32, value >> 2);
    }
    function _glClearBufferiv(buffer, drawbuffer, value) {
      GLctx["clearBufferiv"](buffer, drawbuffer, HEAP32, value >> 2);
    }
    function convertI32PairToI53(lo, hi) {
      return (lo >>> 0) + hi * 4294967296;
    }
    function _glClientWaitSync(sync, flags, timeoutLo, timeoutHi) {
      return GLctx.clientWaitSync(
        GL.syncs[sync],
        flags,
        convertI32PairToI53(timeoutLo, timeoutHi)
      );
    }
    function _glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    }
    function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }
    function _glCompressedTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      imageSize,
      data
    ) {
      if (true) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
          GLctx["compressedTexSubImage2D"](
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            imageSize,
            data
          );
        } else {
          GLctx["compressedTexSubImage2D"](
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            HEAPU8,
            data,
            imageSize
          );
        }
        return;
      }
      GLctx["compressedTexSubImage2D"](
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        data ? HEAPU8.subarray(data, data + imageSize) : null
      );
    }
    function _glCompressedTexSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      imageSize,
      data
    ) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["compressedTexSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          imageSize,
          data
        );
      } else {
        GLctx["compressedTexSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          HEAPU8,
          data,
          imageSize
        );
      }
    }
    function _glCopyBufferSubData(x0, x1, x2, x3, x4) {
      GLctx["copyBufferSubData"](x0, x1, x2, x3, x4);
    }
    function _glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      program.maxUniformLength =
        program.maxAttributeLength =
        program.maxUniformBlockNameLength =
          0;
      program.uniformIdCounter = 1;
      GL.programs[id] = program;
      return id;
    }
    function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }
    function _glCullFace(x0) {
      GLctx["cullFace"](x0);
    }
    function _glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(buffers + i * 4) >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GLctx.currentArrayBufferBinding)
          GLctx.currentArrayBufferBinding = 0;
        if (id == GLctx.currentElementArrayBufferBinding)
          GLctx.currentElementArrayBufferBinding = 0;
        if (id == GLctx.currentPixelPackBufferBinding)
          GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding)
          GLctx.currentPixelUnpackBufferBinding = 0;
      }
    }
    function _glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(framebuffers + i * 4) >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }
    function _glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
    }
    function _glDeleteQueries(n, ids) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(ids + i * 4) >> 2];
        var query = GL.queries[id];
        if (!query) continue;
        GLctx["deleteQuery"](query);
        GL.queries[id] = null;
      }
    }
    function _glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(renderbuffers + i * 4) >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    }
    function _glDeleteSamplers(n, samplers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(samplers + i * 4) >> 2];
        var sampler = GL.samplers[id];
        if (!sampler) continue;
        GLctx["deleteSampler"](sampler);
        sampler.name = 0;
        GL.samplers[id] = null;
      }
    }
    function _glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }
    function _glDeleteSync(id) {
      if (!id) return;
      var sync = GL.syncs[id];
      if (!sync) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteSync(sync);
      sync.name = 0;
      GL.syncs[id] = null;
    }
    function _glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(textures + i * 4) >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }
    function _glDeleteVertexArrays(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(vaos + i * 4) >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null;
      }
    }
    function _glDepthFunc(x0) {
      GLctx["depthFunc"](x0);
    }
    function _glDepthMask(flag) {
      GLctx.depthMask(!!flag);
    }
    function _glDepthRangef(x0, x1) {
      GLctx["depthRange"](x0, x1);
    }
    function _glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
    }
    function _glDisable(x0) {
      GLctx["disable"](x0);
    }
    function _glDisableVertexAttribArray(index) {
      var cb = GL.currentContext.clientBuffers[index];
      cb.enabled = false;
      GLctx.disableVertexAttribArray(index);
    }
    var tempFixedLengthArray = [];
    function _glDrawBuffers(n, bufs) {
      var bufArray = tempFixedLengthArray[n];
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(bufs + i * 4) >> 2];
      }
      GLctx["drawBuffers"](bufArray);
    }
    function _glDrawElementsInstanced(mode, count, type, indices, primcount) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
    }
    function _glDrawElements(mode, count, type, indices) {
      var buf;
      if (!GLctx.currentElementArrayBufferBinding) {
        var size = GL.calcBufLength(1, type, 0, count);
        buf = GL.getTempIndexBuffer(size);
        GLctx.bindBuffer(34963, buf);
        GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
        indices = 0;
      }
      GL.preDrawHandleClientVertexAttribBindings(count);
      GLctx.drawElements(mode, count, type, indices);
      GL.postDrawHandleClientVertexAttribBindings(count);
      if (!GLctx.currentElementArrayBufferBinding) {
        GLctx.bindBuffer(34963, null);
      }
    }
    function _glDrawRangeElements(mode, start, end, count, type, indices) {
      _glDrawElements(mode, count, type, indices);
    }
    function _glEnable(x0) {
      GLctx["enable"](x0);
    }
    function _glEnableVertexAttribArray(index) {
      var cb = GL.currentContext.clientBuffers[index];
      cb.enabled = true;
      GLctx.enableVertexAttribArray(index);
    }
    function _glEndQuery(x0) {
      GLctx["endQuery"](x0);
    }
    function _glFenceSync(condition, flags) {
      var sync = GLctx.fenceSync(condition, flags);
      if (sync) {
        var id = GL.getNewId(GL.syncs);
        sync.name = id;
        GL.syncs[id] = sync;
        return id;
      } else {
        return 0;
      }
    }
    function _glFinish() {
      GLctx["finish"]();
    }
    function _glFlush() {
      GLctx["flush"]();
    }
    function _glFramebufferRenderbuffer(
      target,
      attachment,
      renderbuffertarget,
      renderbuffer
    ) {
      GLctx.framebufferRenderbuffer(
        target,
        attachment,
        renderbuffertarget,
        GL.renderbuffers[renderbuffer]
      );
    }
    function _glFramebufferTexture2D(
      target,
      attachment,
      textarget,
      texture,
      level
    ) {
      GLctx.framebufferTexture2D(
        target,
        attachment,
        textarget,
        GL.textures[texture],
        level
      );
    }
    function _glFramebufferTextureLayer(
      target,
      attachment,
      texture,
      level,
      layer
    ) {
      GLctx.framebufferTextureLayer(
        target,
        attachment,
        GL.textures[texture],
        level,
        layer
      );
    }
    function _glFrontFace(x0) {
      GLctx["frontFace"](x0);
    }
    function __glGenObject(n, buffers, createFunction, objectTable) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
          buffer.name = id;
          objectTable[id] = buffer;
        } else {
          GL.recordError(1282);
        }
        HEAP32[(buffers + i * 4) >> 2] = id;
      }
    }
    function _glGenBuffers(n, buffers) {
      __glGenObject(n, buffers, "createBuffer", GL.buffers);
    }
    function _glGenFramebuffers(n, ids) {
      __glGenObject(n, ids, "createFramebuffer", GL.framebuffers);
    }
    function _glGenQueries(n, ids) {
      __glGenObject(n, ids, "createQuery", GL.queries);
    }
    function _glGenRenderbuffers(n, renderbuffers) {
      __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
    }
    function _glGenSamplers(n, samplers) {
      __glGenObject(n, samplers, "createSampler", GL.samplers);
    }
    function _glGenTextures(n, textures) {
      __glGenObject(n, textures, "createTexture", GL.textures);
    }
    function _glGenVertexArrays(n, arrays) {
      __glGenObject(n, arrays, "createVertexArray", GL.vaos);
    }
    function _glGenerateMipmap(x0) {
      GLctx["generateMipmap"](x0);
    }
    function _glGetBufferSubData(target, offset, size, data) {
      if (!data) {
        GL.recordError(1281);
        return;
      }
      size && GLctx["getBufferSubData"](target, offset, HEAPU8, data, size);
    }
    function _glGetError() {
      var error = GLctx.getError() || GL.lastError;
      GL.lastError = 0;
      return error;
    }
    function writeI53ToI64(ptr, num) {
      HEAPU32[ptr >> 2] = num;
      HEAPU32[(ptr + 4) >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296;
    }
    function emscriptenWebGLGet(name_, p, type) {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      var ret = undefined;
      switch (name_) {
        case 36346:
          ret = 1;
          break;
        case 36344:
          if (type != 0 && type != 1) {
            GL.recordError(1280);
          }
          return;
        case 34814:
        case 36345:
          ret = 0;
          break;
        case 34466:
          var formats = GLctx.getParameter(34467);
          ret = formats ? formats.length : 0;
          break;
        case 33309:
          if (GL.currentContext.version < 2) {
            GL.recordError(1282);
            return;
          }
          var exts = GLctx.getSupportedExtensions() || [];
          ret = 2 * exts.length;
          break;
        case 33307:
        case 33308:
          if (GL.currentContext.version < 2) {
            GL.recordError(1280);
            return;
          }
          ret = name_ == 33307 ? 3 : 0;
          break;
      }
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(1280);
            return;
          case "object":
            if (result === null) {
              switch (name_) {
                case 34964:
                case 35725:
                case 34965:
                case 36006:
                case 36007:
                case 32873:
                case 34229:
                case 36662:
                case 36663:
                case 35053:
                case 35055:
                case 36010:
                case 35097:
                case 35869:
                case 32874:
                case 36389:
                case 35983:
                case 35368:
                case 34068: {
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(1280);
                  return;
                }
              }
            } else if (
              result instanceof Float32Array ||
              result instanceof Uint32Array ||
              result instanceof Int32Array ||
              result instanceof Array
            ) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0:
                    HEAP32[(p + i * 4) >> 2] = result[i];
                    break;
                  case 2:
                    HEAPF32[(p + i * 4) >> 2] = result[i];
                    break;
                  case 4:
                    HEAP8[(p + i) >> 0] = result[i] ? 1 : 0;
                    break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch (e) {
                GL.recordError(1280);
                err(
                  "GL_INVALID_ENUM in glGet" +
                    type +
                    "v: Unknown object returned from WebGL getParameter(" +
                    name_ +
                    ")! (error: " +
                    e +
                    ")"
                );
                return;
              }
            }
            break;
          default:
            GL.recordError(1280);
            err(
              "GL_INVALID_ENUM in glGet" +
                type +
                "v: Native code calling glGet" +
                type +
                "v(" +
                name_ +
                ") and it returns " +
                result +
                " of type " +
                typeof result +
                "!"
            );
            return;
        }
      }
      switch (type) {
        case 1:
          writeI53ToI64(p, ret);
          break;
        case 0:
          HEAP32[p >> 2] = ret;
          break;
        case 2:
          HEAPF32[p >> 2] = ret;
          break;
        case 4:
          HEAP8[p >> 0] = ret ? 1 : 0;
          break;
      }
    }
    function _glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 2);
    }
    function _glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 0);
    }
    function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = "(unknown error)";
      var numBytesWrittenExclNull =
        maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    }
    function _glGetProgramiv(program, pname, p) {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      if (program >= GL.counter) {
        GL.recordError(1281);
        return;
      }
      program = GL.programs[program];
      if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1;
      } else if (pname == 35719) {
        if (!program.maxUniformLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
            program.maxUniformLength = Math.max(
              program.maxUniformLength,
              GLctx.getActiveUniform(program, i).name.length + 1
            );
          }
        }
        HEAP32[p >> 2] = program.maxUniformLength;
      } else if (pname == 35722) {
        if (!program.maxAttributeLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
            program.maxAttributeLength = Math.max(
              program.maxAttributeLength,
              GLctx.getActiveAttrib(program, i).name.length + 1
            );
          }
        }
        HEAP32[p >> 2] = program.maxAttributeLength;
      } else if (pname == 35381) {
        if (!program.maxUniformBlockNameLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
            program.maxUniformBlockNameLength = Math.max(
              program.maxUniformBlockNameLength,
              GLctx.getActiveUniformBlockName(program, i).length + 1
            );
          }
        }
        HEAP32[p >> 2] = program.maxUniformBlockNameLength;
      } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname);
      }
    }
    function _glGetQueryObjectuiv(id, pname, params) {
      if (!params) {
        GL.recordError(1281);
        return;
      }
      var query = GL.queries[id];
      var param = GLctx["getQueryParameter"](query, pname);
      var ret;
      if (typeof param == "boolean") {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      HEAP32[params >> 2] = ret;
    }
    function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = "(unknown error)";
      var numBytesWrittenExclNull =
        maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    }
    function _glGetShaderiv(shader, pname, p) {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = "(unknown error)";
        var logLength = log ? log.length + 1 : 0;
        HEAP32[p >> 2] = logLength;
      } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[p >> 2] = sourceLength;
      } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }
    function stringToNewUTF8(jsString) {
      var length = lengthBytesUTF8(jsString) + 1;
      var cString = _malloc(length);
      stringToUTF8(jsString, cString, length);
      return cString;
    }
    function _glGetString(name_) {
      var ret = GL.stringCache[name_];
      if (!ret) {
        switch (name_) {
          case 7939:
            var exts = GLctx.getSupportedExtensions() || [];
            exts = exts.concat(
              exts.map(function (e) {
                return "GL_" + e;
              })
            );
            ret = stringToNewUTF8(exts.join(" "));
            break;
          case 7936:
          case 7937:
          case 37445:
          case 37446:
            var s = GLctx.getParameter(name_);
            if (!s) {
              GL.recordError(1280);
            }
            ret = s && stringToNewUTF8(s);
            break;
          case 7938:
            var glVersion = GLctx.getParameter(7938);
            if (true) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
            else {
              glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
            }
            ret = stringToNewUTF8(glVersion);
            break;
          case 35724:
            var glslVersion = GLctx.getParameter(35724);
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
              if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
              glslVersion =
                "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
            }
            ret = stringToNewUTF8(glslVersion);
            break;
          default:
            GL.recordError(1280);
        }
        GL.stringCache[name_] = ret;
      }
      return ret;
    }
    function _glGetUniformBlockIndex(program, uniformBlockName) {
      return GLctx["getUniformBlockIndex"](
        GL.programs[program],
        UTF8ToString(uniformBlockName)
      );
    }
    function jstoi_q(str) {
      return parseInt(str);
    }
    function webglGetLeftBracePos(name) {
      return name.slice(-1) == "]" && name.lastIndexOf("[");
    }
    function webglPrepareUniformLocationsBeforeFirstUse(program) {
      var uniformLocsById = program.uniformLocsById,
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
        i,
        j;
      if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
          var u = GLctx.getActiveUniform(program, i);
          var nm = u.name;
          var sz = u.size;
          var lb = webglGetLeftBracePos(nm);
          var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
          var id = program.uniformIdCounter;
          program.uniformIdCounter += sz;
          uniformSizeAndIdsByName[arrayName] = [sz, id];
          for (j = 0; j < sz; ++j) {
            uniformLocsById[id] = j;
            program.uniformArrayNamesById[id++] = arrayName;
          }
        }
      }
    }
    function _glGetUniformLocation(program, name) {
      name = UTF8ToString(name);
      if ((program = GL.programs[program])) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;
        var leftBrace = webglGetLeftBracePos(name);
        if (leftBrace > 0) {
          arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
          uniformBaseName = name.slice(0, leftBrace);
        }
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
          arrayIndex += sizeAndId[1];
          if (
            (uniformLocsById[arrayIndex] =
              uniformLocsById[arrayIndex] ||
              GLctx.getUniformLocation(program, name))
          ) {
            return arrayIndex;
          }
        }
      } else {
        GL.recordError(1281);
      }
      return -1;
    }
    function _glHint(x0, x1) {
      GLctx["hint"](x0, x1);
    }
    function _glInvalidateFramebuffer(target, numAttachments, attachments) {
      var list = tempFixedLengthArray[numAttachments];
      for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[(attachments + i * 4) >> 2];
      }
      GLctx["invalidateFramebuffer"](target, list);
    }
    function _glLinkProgram(program) {
      program = GL.programs[program];
      GLctx.linkProgram(program);
      program.uniformLocsById = 0;
      program.uniformSizeAndIdsByName = {};
    }
    function emscriptenWebGLGetBufferBinding(target) {
      switch (target) {
        case 34962:
          target = 34964;
          break;
        case 34963:
          target = 34965;
          break;
        case 35051:
          target = 35053;
          break;
        case 35052:
          target = 35055;
          break;
        case 35982:
          target = 35983;
          break;
        case 36662:
          target = 36662;
          break;
        case 36663:
          target = 36663;
          break;
        case 35345:
          target = 35368;
          break;
      }
      var buffer = GLctx.getParameter(target);
      if (buffer) return buffer.name | 0;
      else return 0;
    }
    function emscriptenWebGLValidateMapBufferTarget(target) {
      switch (target) {
        case 34962:
        case 34963:
        case 36662:
        case 36663:
        case 35051:
        case 35052:
        case 35882:
        case 35982:
        case 35345:
          return true;
        default:
          return false;
      }
    }
    function _glMapBufferRange(target, offset, length, access) {
      if (access != 26 && access != 10) {
        err(
          "glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER"
        );
        return 0;
      }
      if (!emscriptenWebGLValidateMapBufferTarget(target)) {
        GL.recordError(1280);
        err("GL_INVALID_ENUM in glMapBufferRange");
        return 0;
      }
      var mem = _malloc(length);
      if (!mem) return 0;
      GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)] = {
        offset: offset,
        length: length,
        mem: mem,
        access: access,
      };
      return mem;
    }
    function _glPixelStorei(pname, param) {
      if (pname == 3317) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    }
    function _glPolygonOffset(x0, x1) {
      GLctx["polygonOffset"](x0, x1);
    }
    function computeUnpackAlignedImageSize(
      width,
      height,
      sizePerPixel,
      alignment
    ) {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y;
      }
      var plainRowSize = width * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
      return height * alignedRowSize;
    }
    function __colorChannelsInGlTextureFormat(format) {
      var colorChannels = {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4,
      };
      return colorChannels[format - 6402] || 1;
    }
    function heapObjectForWebGLType(type) {
      type -= 5120;
      if (type == 0) return HEAP8;
      if (type == 1) return HEAPU8;
      if (type == 2) return HEAP16;
      if (type == 4) return HEAP32;
      if (type == 6) return HEAPF32;
      if (
        type == 5 ||
        type == 28922 ||
        type == 28520 ||
        type == 30779 ||
        type == 30782
      )
        return HEAPU32;
      return HEAPU16;
    }
    function heapAccessShiftForWebGLHeap(heap) {
      return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
    }
    function emscriptenWebGLGetTexPixelData(
      type,
      format,
      width,
      height,
      pixels,
      internalFormat
    ) {
      var heap = heapObjectForWebGLType(type);
      var shift = heapAccessShiftForWebGLHeap(heap);
      var byteSize = 1 << shift;
      var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
      var bytes = computeUnpackAlignedImageSize(
        width,
        height,
        sizePerPixel,
        GL.unpackAlignment
      );
      return heap.subarray(pixels >> shift, (pixels + bytes) >> shift);
    }
    function _glReadPixels(x, y, width, height, format, type, pixels) {
      if (true) {
        if (GLctx.currentPixelPackBufferBinding) {
          GLctx.readPixels(x, y, width, height, format, type, pixels);
        } else {
          var heap = heapObjectForWebGLType(type);
          GLctx.readPixels(
            x,
            y,
            width,
            height,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          );
        }
        return;
      }
      var pixelData = emscriptenWebGLGetTexPixelData(
        type,
        format,
        width,
        height,
        pixels,
        format
      );
      if (!pixelData) {
        GL.recordError(1280);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }
    function _glRenderbufferStorage(x0, x1, x2, x3) {
      GLctx["renderbufferStorage"](x0, x1, x2, x3);
    }
    function _glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
      GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4);
    }
    function _glSamplerParameterf(sampler, pname, param) {
      GLctx["samplerParameterf"](GL.samplers[sampler], pname, param);
    }
    function _glSamplerParameteri(sampler, pname, param) {
      GLctx["samplerParameteri"](GL.samplers[sampler], pname, param);
    }
    function _glScissor(x0, x1, x2, x3) {
      GLctx["scissor"](x0, x1, x2, x3);
    }
    function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    }
    function _glStencilFuncSeparate(x0, x1, x2, x3) {
      GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
    }
    function _glStencilMaskSeparate(x0, x1) {
      GLctx["stencilMaskSeparate"](x0, x1);
    }
    function _glStencilOpSeparate(x0, x1, x2, x3) {
      GLctx["stencilOpSeparate"](x0, x1, x2, x3);
    }
    function _glTexParameterf(x0, x1, x2) {
      GLctx["texParameterf"](x0, x1, x2);
    }
    function _glTexParameteri(x0, x1, x2) {
      GLctx["texParameteri"](x0, x1, x2);
    }
    function _glTexStorage2D(x0, x1, x2, x3, x4) {
      GLctx["texStorage2D"](x0, x1, x2, x3, x4);
    }
    function _glTexStorage3D(x0, x1, x2, x3, x4, x5) {
      GLctx["texStorage3D"](x0, x1, x2, x3, x4, x5);
    }
    function _glTexSubImage2D(
      target,
      level,
      xoffset,
      yoffset,
      width,
      height,
      format,
      type,
      pixels
    ) {
      if (true) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            pixels
          );
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type);
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            heap,
            pixels >> heapAccessShiftForWebGLHeap(heap)
          );
        } else {
          GLctx.texSubImage2D(
            target,
            level,
            xoffset,
            yoffset,
            width,
            height,
            format,
            type,
            null
          );
        }
        return;
      }
      var pixelData = null;
      if (pixels)
        pixelData = emscriptenWebGLGetTexPixelData(
          type,
          format,
          width,
          height,
          pixels,
          0
        );
      GLctx.texSubImage2D(
        target,
        level,
        xoffset,
        yoffset,
        width,
        height,
        format,
        type,
        pixelData
      );
    }
    function _glTexSubImage3D(
      target,
      level,
      xoffset,
      yoffset,
      zoffset,
      width,
      height,
      depth,
      format,
      type,
      pixels
    ) {
      if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx["texSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          type,
          pixels
        );
      } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx["texSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          type,
          heap,
          pixels >> heapAccessShiftForWebGLHeap(heap)
        );
      } else {
        GLctx["texSubImage3D"](
          target,
          level,
          xoffset,
          yoffset,
          zoffset,
          width,
          height,
          depth,
          format,
          type,
          null
        );
      }
    }
    function webglGetUniformLocation(location) {
      var p = GLctx.currentProgram;
      if (p) {
        var webglLoc = p.uniformLocsById[location];
        if (typeof webglLoc == "number") {
          p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(
            p,
            p.uniformArrayNamesById[location] +
              (webglLoc > 0 ? "[" + webglLoc + "]" : "")
          );
        }
        return webglLoc;
      } else {
        GL.recordError(1282);
      }
    }
    function _glUniform1i(location, v0) {
      GLctx.uniform1i(webglGetUniformLocation(location), v0);
    }
    function _glUniformBlockBinding(
      program,
      uniformBlockIndex,
      uniformBlockBinding
    ) {
      program = GL.programs[program];
      GLctx["uniformBlockBinding"](
        program,
        uniformBlockIndex,
        uniformBlockBinding
      );
    }
    function _glUnmapBuffer(target) {
      if (!emscriptenWebGLValidateMapBufferTarget(target)) {
        GL.recordError(1280);
        err("GL_INVALID_ENUM in glUnmapBuffer");
        return 0;
      }
      var buffer = emscriptenWebGLGetBufferBinding(target);
      var mapping = GL.mappedBuffers[buffer];
      if (!mapping) {
        GL.recordError(1282);
        err("buffer was never mapped in glUnmapBuffer");
        return 0;
      }
      GL.mappedBuffers[buffer] = null;
      if (!(mapping.access & 16))
        if (true) {
          GLctx.bufferSubData(
            target,
            mapping.offset,
            HEAPU8,
            mapping.mem,
            mapping.length
          );
        } else {
          GLctx.bufferSubData(
            target,
            mapping.offset,
            HEAPU8.subarray(mapping.mem, mapping.mem + mapping.length)
          );
        }
      _free(mapping.mem);
      return 1;
    }
    function _glUseProgram(program) {
      program = GL.programs[program];
      GLctx.useProgram(program);
      GLctx.currentProgram = program;
    }
    function _glVertexAttrib4f(x0, x1, x2, x3, x4) {
      GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4);
    }
    function _glVertexAttribI4ui(x0, x1, x2, x3, x4) {
      GLctx["vertexAttribI4ui"](x0, x1, x2, x3, x4);
    }
    function _glVertexAttribIPointer(index, size, type, stride, ptr) {
      var cb = GL.currentContext.clientBuffers[index];
      if (!GLctx.currentArrayBufferBinding) {
        cb.size = size;
        cb.type = type;
        cb.normalized = false;
        cb.stride = stride;
        cb.ptr = ptr;
        cb.clientside = true;
        cb.vertexAttribPointerAdaptor = function (
          index,
          size,
          type,
          normalized,
          stride,
          ptr
        ) {
          this.vertexAttribIPointer(index, size, type, stride, ptr);
        };
        return;
      }
      cb.clientside = false;
      GLctx["vertexAttribIPointer"](index, size, type, stride, ptr);
    }
    function _glVertexAttribPointer(
      index,
      size,
      type,
      normalized,
      stride,
      ptr
    ) {
      var cb = GL.currentContext.clientBuffers[index];
      if (!GLctx.currentArrayBufferBinding) {
        cb.size = size;
        cb.type = type;
        cb.normalized = normalized;
        cb.stride = stride;
        cb.ptr = ptr;
        cb.clientside = true;
        cb.vertexAttribPointerAdaptor = function (
          index,
          size,
          type,
          normalized,
          stride,
          ptr
        ) {
          this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
        };
        return;
      }
      cb.clientside = false;
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }
    function _glViewport(x0, x1, x2, x3) {
      GLctx["viewport"](x0, x1, x2, x3);
    }
    function _glWaitSync(sync, flags, timeoutLo, timeoutHi) {
      GLctx.waitSync(
        GL.syncs[sync],
        flags,
        convertI32PairToI53(timeoutLo, timeoutHi)
      );
    }
    function _setTempRet0(val) {
      setTempRet0(val);
    }
    function __isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {}
      return sum;
    }
    var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (
          leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR
        )[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1;
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1);
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
        } else {
          newDate.setDate(newDate.getDate() + days);
          return newDate;
        }
      }
      return newDate;
    }
    function _strftime(s, maxsize, format, tm) {
      var tm_zone = HEAP32[(tm + 40) >> 2];
      var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[(tm + 4) >> 2],
        tm_hour: HEAP32[(tm + 8) >> 2],
        tm_mday: HEAP32[(tm + 12) >> 2],
        tm_mon: HEAP32[(tm + 16) >> 2],
        tm_year: HEAP32[(tm + 20) >> 2],
        tm_wday: HEAP32[(tm + 24) >> 2],
        tm_yday: HEAP32[(tm + 28) >> 2],
        tm_isdst: HEAP32[(tm + 32) >> 2],
        tm_gmtoff: HEAP32[(tm + 36) >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
      };
      var pattern = UTF8ToString(format);
      var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y",
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(
          new RegExp(rule, "g"),
          EXPANSION_RULES_1[rule]
        );
      }
      var WEEKDAYS = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      var MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      function leadingSomething(value, digits, character) {
        var str = typeof value == "number" ? value.toString() : value || "";
        while (str.length < digits) {
          str = character[0] + str;
        }
        return str;
      }
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0");
      }
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate());
          }
        }
        return compare;
      }
      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29);
          case 1:
            return janFourth;
          case 2:
            return new Date(janFourth.getFullYear(), 0, 3);
          case 3:
            return new Date(janFourth.getFullYear(), 0, 2);
          case 4:
            return new Date(janFourth.getFullYear(), 0, 1);
          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
      }
      function getWeekBasedYear(date) {
        var thisDate = __addDays(
          new Date(date.tm_year + 1900, 0, 1),
          date.tm_yday
        );
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1;
          } else {
            return thisDate.getFullYear();
          }
        } else {
          return thisDate.getFullYear() - 1;
        }
      }
      var EXPANSION_RULES_2 = {
        "%a": function (date) {
          return WEEKDAYS[date.tm_wday].substring(0, 3);
        },
        "%A": function (date) {
          return WEEKDAYS[date.tm_wday];
        },
        "%b": function (date) {
          return MONTHS[date.tm_mon].substring(0, 3);
        },
        "%B": function (date) {
          return MONTHS[date.tm_mon];
        },
        "%C": function (date) {
          var year = date.tm_year + 1900;
          return leadingNulls((year / 100) | 0, 2);
        },
        "%d": function (date) {
          return leadingNulls(date.tm_mday, 2);
        },
        "%e": function (date) {
          return leadingSomething(date.tm_mday, 2, " ");
        },
        "%g": function (date) {
          return getWeekBasedYear(date).toString().substring(2);
        },
        "%G": function (date) {
          return getWeekBasedYear(date);
        },
        "%H": function (date) {
          return leadingNulls(date.tm_hour, 2);
        },
        "%I": function (date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        "%j": function (date) {
          return leadingNulls(
            date.tm_mday +
              __arraySum(
                __isLeapYear(date.tm_year + 1900)
                  ? __MONTH_DAYS_LEAP
                  : __MONTH_DAYS_REGULAR,
                date.tm_mon - 1
              ),
            3
          );
        },
        "%m": function (date) {
          return leadingNulls(date.tm_mon + 1, 2);
        },
        "%M": function (date) {
          return leadingNulls(date.tm_min, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return "AM";
          } else {
            return "PM";
          }
        },
        "%S": function (date) {
          return leadingNulls(date.tm_sec, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (date) {
          return date.tm_wday || 7;
        },
        "%U": function (date) {
          var days = date.tm_yday + 7 - date.tm_wday;
          return leadingNulls(Math.floor(days / 7), 2);
        },
        "%V": function (date) {
          var val = Math.floor(
            (date.tm_yday + 7 - ((date.tm_wday + 6) % 7)) / 7
          );
          if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
            val++;
          }
          if (!val) {
            val = 52;
            var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
            if (
              dec31 == 4 ||
              (dec31 == 5 && __isLeapYear((date.tm_year % 400) - 1))
            ) {
              val++;
            }
          } else if (val == 53) {
            var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
            if (jan1 != 4 && (jan1 != 3 || !__isLeapYear(date.tm_year)))
              val = 1;
          }
          return leadingNulls(val, 2);
        },
        "%w": function (date) {
          return date.tm_wday;
        },
        "%W": function (date) {
          var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
          return leadingNulls(Math.floor(days / 7), 2);
        },
        "%y": function (date) {
          return (date.tm_year + 1900).toString().substring(2);
        },
        "%Y": function (date) {
          return date.tm_year + 1900;
        },
        "%z": function (date) {
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          off = (off / 60) * 100 + (off % 60);
          return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
        },
        "%Z": function (date) {
          return date.tm_zone;
        },
        "%%": function () {
          return "%";
        },
      };
      pattern = pattern.replace(/%%/g, "\0\0");
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(
            new RegExp(rule, "g"),
            EXPANSION_RULES_2[rule](date)
          );
        }
      }
      pattern = pattern.replace(/\0\0/g, "%");
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
      writeArrayToMemory(bytes, s);
      return bytes.length - 1;
    }
    function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm);
    }
    var FSNode = function (parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.mounted = null;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.node_ops = {};
      this.stream_ops = {};
      this.rdev = rdev;
    };
    var readMode = 292 | 73;
    var writeMode = 146;
    Object.defineProperties(FSNode.prototype, {
      read: {
        get: function () {
          return (this.mode & readMode) === readMode;
        },
        set: function (val) {
          val ? (this.mode |= readMode) : (this.mode &= ~readMode);
        },
      },
      write: {
        get: function () {
          return (this.mode & writeMode) === writeMode;
        },
        set: function (val) {
          val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
        },
      },
      isFolder: {
        get: function () {
          return FS.isDir(this.mode);
        },
      },
      isDevice: {
        get: function () {
          return FS.isChrdev(this.mode);
        },
      },
    });
    FS.FSNode = FSNode;
    FS.staticInit();
    InternalError = Module["InternalError"] = extendError(
      Error,
      "InternalError"
    );
    embind_init_charCodes();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    init_ClassHandle();
    init_embind();
    init_RegisteredPointer();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(
      Error,
      "UnboundTypeError"
    );
    init_emval();
    var GLctx;
    for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(
        stringy,
        u8array,
        0,
        u8array.length
      );
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    }
    var asmLibraryArg = {
      e: ___cxa_allocate_exception,
      d: ___cxa_throw,
      Na: ___syscall_fcntl64,
      Nb: ___syscall_fstat64,
      Gb: ___syscall_getdents64,
      Ma: ___syscall_ioctl,
      Kb: ___syscall_lstat64,
      Lb: ___syscall_newfstatat,
      Ja: ___syscall_openat,
      Mb: ___syscall_stat64,
      Rb: __dlinit,
      Tb: __dlopen_js,
      Sb: __dlsym_js,
      A: __embind_finalize_value_array,
      o: __embind_finalize_value_object,
      yb: __embind_register_bigint,
      Vb: __embind_register_bool,
      f: __embind_register_class,
      n: __embind_register_class_class_function,
      m: __embind_register_class_constructor,
      a: __embind_register_class_function,
      z: __embind_register_class_property,
      Ub: __embind_register_emval,
      i: __embind_register_enum,
      b: __embind_register_enum_value,
      Pa: __embind_register_float,
      M: __embind_register_function,
      G: __embind_register_integer,
      s: __embind_register_memory_view,
      Oa: __embind_register_std_string,
      ia: __embind_register_std_wstring,
      B: __embind_register_value_array,
      g: __embind_register_value_array_element,
      p: __embind_register_value_object,
      c: __embind_register_value_object_field,
      Wb: __embind_register_void,
      ha: __emscripten_date_now,
      Pb: __emscripten_get_now_is_monotonic,
      Db: __emscripten_throw_longjmp,
      v: __emval_as,
      h: __emval_decref,
      w: __emval_get_property,
      Y: __emval_incref,
      L: __emval_new_cstring,
      u: __emval_run_destructors,
      x: __emval_take_value,
      Hb: __munmap_js,
      k: _abort,
      r: _emscripten_asm_const_int,
      Fb: _emscripten_get_heap_max,
      Ob: _emscripten_get_now,
      Qb: _emscripten_memcpy_big,
      Eb: _emscripten_resize_heap,
      Ia: _emscripten_websocket_close,
      Ha: _emscripten_websocket_delete,
      wb: _emscripten_websocket_is_supported,
      vb: _emscripten_websocket_new,
      sb: _emscripten_websocket_send_utf8_text,
      ub: _emscripten_websocket_set_onmessage_callback_on_thread,
      tb: _emscripten_websocket_set_onopen_callback_on_thread,
      Ib: _environ_get,
      Jb: _environ_sizes_get,
      Z: _fd_close,
      La: _fd_read,
      xb: _fd_seek,
      Ka: _fd_write,
      O: _getTempRet0,
      Bb: _getentropy,
      j: _glActiveTexture,
      $: _glAttachShader,
      mc: _glBeginQuery,
      q: _glBindBuffer,
      wa: _glBindBufferBase,
      ja: _glBindBufferRange,
      t: _glBindFramebuffer,
      Va: _glBindRenderbuffer,
      fa: _glBindSampler,
      l: _glBindTexture,
      C: _glBindVertexArray,
      za: _glBlendEquationSeparate,
      ya: _glBlendFuncSeparate,
      Za: _glBlitFramebuffer,
      Q: _glBufferData,
      ka: _glBufferSubData,
      ac: _glClearBufferfi,
      I: _glClearBufferfv,
      $b: _glClearBufferiv,
      zb: _glClientWaitSync,
      da: _glColorMask,
      kb: _glCompileShader,
      Sa: _glCompressedTexSubImage2D,
      Ra: _glCompressedTexSubImage3D,
      pc: _glCopyBufferSubData,
      jb: _glCreateProgram,
      mb: _glCreateShader,
      Aa: _glCullFace,
      ea: _glDeleteBuffers,
      la: _glDeleteFramebuffers,
      ra: _glDeleteProgram,
      $a: _glDeleteQueries,
      ma: _glDeleteRenderbuffers,
      Ca: _glDeleteSamplers,
      aa: _glDeleteShader,
      R: _glDeleteSync,
      na: _glDeleteTextures,
      ob: _glDeleteVertexArrays,
      ga: _glDepthFunc,
      ca: _glDepthMask,
      ta: _glDepthRangef,
      sa: _glDetachShader,
      y: _glDisable,
      dc: _glDisableVertexAttribArray,
      bb: _glDrawBuffers,
      nc: _glDrawElementsInstanced,
      oc: _glDrawRangeElements,
      K: _glEnable,
      gc: _glEnableVertexAttribArray,
      lc: _glEndQuery,
      _: _glFenceSync,
      Ga: _glFinish,
      rb: _glFlush,
      S: _glFramebufferRenderbuffer,
      Xa: _glFramebufferTexture2D,
      Wa: _glFramebufferTextureLayer,
      Ba: _glFrontFace,
      U: _glGenBuffers,
      oa: _glGenFramebuffers,
      ab: _glGenQueries,
      ba: _glGenRenderbuffers,
      Ea: _glGenSamplers,
      T: _glGenTextures,
      nb: _glGenVertexArrays,
      rc: _glGenerateMipmap,
      _b: _glGetBufferSubData,
      Fa: _glGetError,
      qb: _glGetFloatv,
      F: _glGetIntegerv,
      gb: _glGetProgramInfoLog,
      qa: _glGetProgramiv,
      kc: _glGetQueryObjectuiv,
      hb: _glGetShaderInfoLog,
      pa: _glGetShaderiv,
      N: _glGetString,
      fb: _glGetUniformBlockIndex,
      db: _glGetUniformLocation,
      pb: _glHint,
      _a: _glInvalidateFramebuffer,
      ib: _glLinkProgram,
      Zb: _glMapBufferRange,
      E: _glPixelStorei,
      xa: _glPolygonOffset,
      qc: _glReadPixels,
      bc: _glRenderbufferStorage,
      cc: _glRenderbufferStorageMultisample,
      Da: _glSamplerParameterf,
      P: _glSamplerParameteri,
      va: _glScissor,
      lb: _glShaderSource,
      W: _glStencilFuncSeparate,
      J: _glStencilMaskSeparate,
      V: _glStencilOpSeparate,
      sc: _glTexParameterf,
      D: _glTexParameteri,
      jc: _glTexStorage2D,
      Ya: _glTexStorage3D,
      Ua: _glTexSubImage2D,
      Ta: _glTexSubImage3D,
      cb: _glUniform1i,
      eb: _glUniformBlockBinding,
      Yb: _glUnmapBuffer,
      X: _glUseProgram,
      ec: _glVertexAttrib4f,
      fc: _glVertexAttribI4ui,
      ic: _glVertexAttribIPointer,
      hc: _glVertexAttribPointer,
      ua: _glViewport,
      Ab: _glWaitSync,
      Qa: invoke_iii,
      Xb: invoke_vii,
      H: _setTempRet0,
      Cb: _strftime_l,
    };
    var asm = createWasm();
    var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] =
        Module["asm"]["uc"]).apply(null, arguments);
    });
    var _free = (Module["_free"] = function () {
      return (_free = Module["_free"] = Module["asm"]["wc"]).apply(
        null,
        arguments
      );
    });
    var _malloc = (Module["_malloc"] = function () {
      return (_malloc = Module["_malloc"] = Module["asm"]["xc"]).apply(
        null,
        arguments
      );
    });
    var _ma_device_process_pcm_frames_capture__webaudio = (Module[
      "_ma_device_process_pcm_frames_capture__webaudio"
    ] = function () {
      return (_ma_device_process_pcm_frames_capture__webaudio = Module[
        "_ma_device_process_pcm_frames_capture__webaudio"
      ] =
        Module["asm"]["yc"]).apply(null, arguments);
    });
    var _ma_device_process_pcm_frames_playback__webaudio = (Module[
      "_ma_device_process_pcm_frames_playback__webaudio"
    ] = function () {
      return (_ma_device_process_pcm_frames_playback__webaudio = Module[
        "_ma_device_process_pcm_frames_playback__webaudio"
      ] =
        Module["asm"]["zc"]).apply(null, arguments);
    });
    var ___errno_location = (Module["___errno_location"] = function () {
      return (___errno_location = Module["___errno_location"] =
        Module["asm"]["Ac"]).apply(null, arguments);
    });
    var ___getTypeName = (Module["___getTypeName"] = function () {
      return (___getTypeName = Module["___getTypeName"] =
        Module["asm"]["Bc"]).apply(null, arguments);
    });
    var ___embind_register_native_and_builtin_types = (Module[
      "___embind_register_native_and_builtin_types"
    ] = function () {
      return (___embind_register_native_and_builtin_types = Module[
        "___embind_register_native_and_builtin_types"
      ] =
        Module["asm"]["Cc"]).apply(null, arguments);
    });
    var _emscripten_builtin_memalign = (Module["_emscripten_builtin_memalign"] =
      function () {
        return (_emscripten_builtin_memalign = Module[
          "_emscripten_builtin_memalign"
        ] =
          Module["asm"]["Dc"]).apply(null, arguments);
      });
    var _setThrew = (Module["_setThrew"] = function () {
      return (_setThrew = Module["_setThrew"] = Module["asm"]["Ec"]).apply(
        null,
        arguments
      );
    });
    var stackSave = (Module["stackSave"] = function () {
      return (stackSave = Module["stackSave"] = Module["asm"]["Fc"]).apply(
        null,
        arguments
      );
    });
    var stackRestore = (Module["stackRestore"] = function () {
      return (stackRestore = Module["stackRestore"] =
        Module["asm"]["Gc"]).apply(null, arguments);
    });
    var ___cxa_is_pointer_type = (Module["___cxa_is_pointer_type"] =
      function () {
        return (___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] =
          Module["asm"]["Hc"]).apply(null, arguments);
      });
    var dynCall_iiji = (Module["dynCall_iiji"] = function () {
      return (dynCall_iiji = Module["dynCall_iiji"] =
        Module["asm"]["Ic"]).apply(null, arguments);
    });
    var dynCall_iiiji = (Module["dynCall_iiiji"] = function () {
      return (dynCall_iiiji = Module["dynCall_iiiji"] =
        Module["asm"]["Jc"]).apply(null, arguments);
    });
    var dynCall_iij = (Module["dynCall_iij"] = function () {
      return (dynCall_iij = Module["dynCall_iij"] = Module["asm"]["Kc"]).apply(
        null,
        arguments
      );
    });
    var dynCall_jii = (Module["dynCall_jii"] = function () {
      return (dynCall_jii = Module["dynCall_jii"] = Module["asm"]["Lc"]).apply(
        null,
        arguments
      );
    });
    var dynCall_iiiiij = (Module["dynCall_iiiiij"] = function () {
      return (dynCall_iiiiij = Module["dynCall_iiiiij"] =
        Module["asm"]["Mc"]).apply(null, arguments);
    });
    var dynCall_iiij = (Module["dynCall_iiij"] = function () {
      return (dynCall_iiij = Module["dynCall_iiij"] =
        Module["asm"]["Nc"]).apply(null, arguments);
    });
    var dynCall_iiiij = (Module["dynCall_iiiij"] = function () {
      return (dynCall_iiiij = Module["dynCall_iiiij"] =
        Module["asm"]["Oc"]).apply(null, arguments);
    });
    var dynCall_vij = (Module["dynCall_vij"] = function () {
      return (dynCall_vij = Module["dynCall_vij"] = Module["asm"]["Pc"]).apply(
        null,
        arguments
      );
    });
    var dynCall_jiji = (Module["dynCall_jiji"] = function () {
      return (dynCall_jiji = Module["dynCall_jiji"] =
        Module["asm"]["Qc"]).apply(null, arguments);
    });
    var dynCall_viijii = (Module["dynCall_viijii"] = function () {
      return (dynCall_viijii = Module["dynCall_viijii"] =
        Module["asm"]["Rc"]).apply(null, arguments);
    });
    var dynCall_iiiiijj = (Module["dynCall_iiiiijj"] = function () {
      return (dynCall_iiiiijj = Module["dynCall_iiiiijj"] =
        Module["asm"]["Sc"]).apply(null, arguments);
    });
    var dynCall_iiiiiijj = (Module["dynCall_iiiiiijj"] = function () {
      return (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] =
        Module["asm"]["Tc"]).apply(null, arguments);
    });
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vii(index, a1, a2) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    var calledRun;
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run(args) {
      args = args || arguments_;
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    Module["run"] = run;
    function exit(status, implicit) {
      EXITSTATUS = status;
      procExit(status);
    }
    function procExit(code) {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        if (Module["onExit"]) Module["onExit"](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();
    return CTEngine.ready;
  };
})();

if (typeof exports === "object" && typeof module === "object") {
  module.exports = CTEngine;
} else if (typeof define === "function" && define["amd"])
  define([], function () {
    return CTEngine;
  });
else if (typeof exports === "object") exports["CTEngine"] = CTEngine;
/*
 * Copyright (C) 2018 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CTEngine.onReadyListeners = [];

CTEngine.isReady = false;

/// init ::function:: Downloads assets, loads the CTEngine module, and invokes a callback when done.
///
/// All JavaScript clients must call the init function, passing in a list of asset URL's and a
/// callback. This callback gets invoked only after all assets have been downloaded and the CTEngine
/// WebAssembly module has been loaded. Clients should only pass asset URL's that absolutely must
/// be ready at initialization time.
///
/// When the callback is called, each downloaded asset is available in the `CTEngine.assets` global
/// object, which contains a mapping from URL's to Uint8Array objects.
///
/// assets ::argument:: Array of strings containing URL's of required assets.
/// onready ::argument:: callback that gets invoked after all assets have been downloaded and the \
/// CTEngine WebAssembly module has been loaded.
CTEngine.init = (assets, onready) => {
  if (onready) {
    CTEngine.onReadyListeners.push(onready);
  }

  if (CTEngine.initialized) {
    console.assert(
      !assets || assets.length == 0,
      "Assets can be specified only with the first call to init."
    );
    return;
  }
  CTEngine.initialized = true;

  CTEngine.assets = {};

  // Usage of glmatrix is optional. If it exists, then go ahead and augment it with some
  // useful math functions.
  if (typeof glMatrix !== "undefined") {
    CTEngine.loadMathExtensions();
  }

  // One task for compiling & loading the wasm file, plus one task for each asset.
  let remainingTasks = 1 + assets.length;
  const taskFinished = () => {
    if (--remainingTasks == 0) {
      for (const callback of CTEngine.onReadyListeners) {
        callback();
      }
      CTEngine.isReady = true;
    }
  };

  // Issue a fetch for each asset.
  CTEngine.fetch(assets, null, taskFinished);

  // Emscripten creates a global function called "CTEngine" that returns a promise that
  // resolves to a module. Here we replace the function with the module. Note that our
  // TypeScript bindings assume that CTEngine is a namespace, not a function.
  CTEngine().then((module) => {
    // Merge our extension functions into the emscripten module, not the other
    // way around, because Emscripten potentially replaces the HEAPU8 views in
    // the original module object (e.g. if it needs to grow the heap).
    CTEngine = Object.assign(module, CTEngine);

    // At this point, emscripten has finished compiling and instancing the WebAssembly module.
    // The JS classes that correspond to core CTEngine classes (e.g., Engine) are not guaranteed
    // to exist until now.

    CTEngine.loadClassExtensions();
    taskFinished();
  });
};

CTEngine.clearAssetCache = () => {
  for (const key in CTEngine.assets) delete CTEngine.assets[key];
};

/// fetch ::function:: Downloads assets and invokes a callback when done.
///
/// This utility consumes an array of URI strings and invokes callbacks after each asset is
/// downloaded. Additionally, each downloaded asset becomes available in the `CTEngine.assets`
/// global object, which is a mapping from URI strings to `Uint8Array`. If desired, clients can
/// pre-populate entries in `CTEngine.assets` to circumvent HTTP requests (this should be done after
/// calling `CTEngine.init`).
///
/// This function is used internally by `CTEngine.init` and `gltfio$CTEngineAsset.loadResources`.
///
/// assets ::argument:: Array of strings containing URL's of required assets.
/// onDone ::argument:: callback that gets invoked after all assets have been downloaded.
/// onFetched ::argument:: optional callback that's invoked after each asset is downloaded.
CTEngine.fetch = (assets, onDone, onFetched) => {
  let remainingAssets = assets.length;
  assets.forEach((name) => {
    // Check if a buffer already exists in case the client wishes
    // to provide its own data rather than using a HTTP request.
    if (CTEngine.assets[name]) {
      if (onFetched) {
        onFetched(name);
      }
      if (--remainingAssets === 0 && onDone) {
        onDone();
      }
    } else {
      m_fetch
        .fetch(name)
        .then((response) => {
          //console.log(name)
          if (!response.statusCode === 200) {
            throw new Error(name);
          }
          return response.data;
        })
        .then((arrayBuffer) => {
          CTEngine.assets[name] = new Uint8Array(arrayBuffer);
          if (onFetched) {
            onFetched(name);
          }
          if (--remainingAssets === 0 && onDone) {
            onDone();
          }
        });
    }
  });
};

// This file has been generated by beamsplitter

CTEngine.loadGeneratedExtensions = function () {
  CTEngine.View.prototype.setDynamicResolutionOptionsDefaults = function (
    overrides
  ) {
    const options = {
      minScale: [0.5, 0.5],
      maxScale: [1.0, 1.0],
      sharpness: 0.9,
      enabled: false,
      homogeneousScaling: false,
      quality: CTEngine.View$QualityLevel.LOW,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setBloomOptionsDefaults = function (overrides) {
    const options = {
      // JavaScript binding for dirt is not yet supported, must use default value.
      // JavaScript binding for dirtStrength is not yet supported, must use default value.
      strength: 0.1,
      resolution: 360,
      anamorphism: 1.0,
      levels: 6,
      blendMode: CTEngine.View$BloomOptions$BlendMode.ADD,
      threshold: true,
      enabled: false,
      highlight: 1000.0,
      lensFlare: false,
      starburst: true,
      chromaticAberration: 0.005,
      ghostCount: 4,
      ghostSpacing: 0.6,
      ghostThreshold: 10.0,
      haloThickness: 0.1,
      haloRadius: 0.4,
      haloThreshold: 10.0,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setFogOptionsDefaults = function (overrides) {
    const options = {
      distance: 0.0,
      maximumOpacity: 1.0,
      height: 0.0,
      heightFalloff: 1.0,
      color: [0.5, 0.5, 0.5],
      density: 0.1,
      inScatteringStart: 0.0,
      inScatteringSize: -1.0,
      fogColorFromIbl: false,
      enabled: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setDepthOfFieldOptionsDefaults = function (
    overrides
  ) {
    const options = {
      cocScale: 1.0,
      maxApertureDiameter: 0.01,
      enabled: false,
      filter: CTEngine.View$DepthOfFieldOptions$Filter.MEDIAN,
      nativeResolution: false,
      foregroundRingCount: 0,
      backgroundRingCount: 0,
      fastGatherRingCount: 0,
      maxForegroundCOC: 0,
      maxBackgroundCOC: 0,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setVignetteOptionsDefaults = function (overrides) {
    const options = {
      midPoint: 0.5,
      roundness: 0.5,
      feather: 0.5,
      color: [0.0, 0.0, 0.0, 1.0],
      enabled: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setRenderQualityDefaults = function (overrides) {
    const options = {
      hdrColorBuffer: CTEngine.View$QualityLevel.HIGH,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setSsctDefaults = function (overrides) {
    const options = {
      lightConeRad: 1.0,
      shadowDistance: 0.3,
      contactDistanceMax: 1.0,
      intensity: 0.8,
      lightDirection: [0, -1, 0],
      depthBias: 0.01,
      depthSlopeBias: 0.01,
      sampleCount: 4,
      rayCount: 1,
      enabled: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setAmbientOcclusionOptionsDefaults = function (
    overrides
  ) {
    const options = {
      radius: 0.3,
      power: 1.0,
      bias: 0.0005,
      resolution: 0.5,
      intensity: 1.0,
      bilateralThreshold: 0.05,
      quality: CTEngine.View$QualityLevel.LOW,
      lowPassFilter: CTEngine.View$QualityLevel.MEDIUM,
      upsampling: CTEngine.View$QualityLevel.LOW,
      enabled: false,
      bentNormals: false,
      minHorizonAngleRad: 0.0,
      // JavaScript binding for ssct is not yet supported, must use default value.
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setMultiSampleAntiAliasingOptionsDefaults = function (
    overrides
  ) {
    const options = {
      enabled: false,
      sampleCount: 4,
      customResolve: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setTemporalAntiAliasingOptionsDefaults = function (
    overrides
  ) {
    const options = {
      filterWidth: 1.0,
      feedback: 0.04,
      enabled: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setScreenSpaceReflectionsOptionsDefaults = function (
    overrides
  ) {
    const options = {
      thickness: 0.1,
      bias: 0.01,
      maxDistance: 3.0,
      stride: 2.0,
      enabled: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setGuardBandOptionsDefaults = function (overrides) {
    const options = {
      enabled: false,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setVsmShadowOptionsDefaults = function (overrides) {
    const options = {
      anisotropy: 0,
      mipmapping: false,
      msaaSamples: 1,
      highPrecision: false,
      minVarianceScale: 0.5,
      lightBleedReduction: 0.15,
    };
    return Object.assign(options, overrides);
  };

  CTEngine.View.prototype.setSoftShadowOptionsDefaults = function (overrides) {
    const options = {
      penumbraScale: 1.0,
      penumbraRatioScale: 1.0,
    };
    return Object.assign(options, overrides);
  };
};

/*
 * Copyright (C) 2018 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Private utility that converts an asset string or Uint8Array into a low-level buffer descriptor.
// Note that the low-level buffer descriptor must be manually deleted.
function getBufferDescriptor(buffer) {
  if ("string" == typeof buffer || buffer instanceof String) {
    buffer = CTEngine.assets[buffer];
  }
  if (buffer.buffer instanceof ArrayBuffer) {
    buffer = CTEngine.Buffer(buffer);
  }
  return buffer;
}

function isTexture(uri) {
  // TODO: This is not a great way to determine if a resource is a texture, but we can
  // remove it after gltfio gains support for concurrent downloading of vertex data:
  // https://github.com/google/CTEngine/issues/5909
  if (uri.endsWith(".png")) {
    return true;
  }
  if (uri.endsWith(".ktx2")) {
    return true;
  }
  if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) {
    return true;
  }
  return false;
}

CTEngine.vectorToArray = function (vector) {
  const result = [];
  for (let i = 0; i < vector.size(); i++) {
    result.push(vector.get(i));
  }
  return result;
};

CTEngine.shadowOptions = function (overrides) {
  const options = {
    mapSize: 1024,
    shadowCascades: 1,
    constantBias: 0.001,
    normalBias: 1.0,
    shadowFar: 0.0,
    shadowNearHint: 1.0,
    shadowFarHint: 100.0,
    stable: false,
    polygonOffsetConstant: 0.5,
    polygonOffsetSlope: 2.0,
    screenSpaceContactShadows: false,
    stepCount: 8,
    maxShadowDistance: 0.3,
  };
  return Object.assign(options, overrides);
};

CTEngine.loadClassExtensions = function () {
  CTEngine.loadGeneratedExtensions();

  /// Engine ::core class::

  /// create ::static method:: Creates an Engine instance for the given canvas.
  /// canvas ::argument:: the canvas DOM element
  /// options ::argument:: optional WebGL 2.0 context configuration
  /// ::retval:: an instance of [Engine]
  CTEngine.Engine.create = function (canvas, options) {
    const defaults = {
      majorVersion: 2,
      minorVersion: 0,
      antialias: false,
      depth: true,
      alpha: false,
    };
    options = Object.assign(defaults, options);

    // Create the WebGL 2.0 context.
    const ctx = canvas.getContext("webgl2", options);

    // Enable all desired extensions by calling getExtension on each one.
    ctx.getExtension("WEBGL_compressed_texture_s3tc");
    ctx.getExtension("WEBGL_compressed_texture_s3tc_srgb");
    ctx.getExtension("WEBGL_compressed_texture_astc");
    ctx.getExtension("WEBGL_compressed_texture_etc");

    // These transient globals are used temporarily during Engine construction.
    getApp().globalData.CTEngine_glOptions = options;
    getApp().globalData.CTEngine_glContext = ctx;

    // Register the GL context with emscripten and create the Engine.
    const engine = CTEngine.Engine._create();

    // Annotate the engine with the GL context to support multiple canvases.
    engine.context = getApp().globalData.CTEngine_glContext;
    engine.handle = getApp().globalData.CTEngine_contextHandle;

    // Ensure that we do not pollute the global namespace.
    delete getApp().globalData.CTEngine_glOptions;
    delete getApp().globalData.CTEngine_glContext;
    delete getApp().globalData.CTEngine_contextHandle;

    return engine;
  };

  CTEngine.Engine.prototype.execute = function () {
    getApp().globalData.CTEngine_contextHandle = this.handle;
    this._execute();
    delete getApp().globalData.CTEngine_contextHandle;
  };

  /// createMaterial ::method::
  /// package ::argument:: asset string, or Uint8Array, or [Buffer] with filamat contents
  /// ::retval:: an instance of [createMaterial]
  CTEngine.Engine.prototype.createMaterial = function (buffer) {
    buffer = getBufferDescriptor(buffer);
    const result = this._createMaterial(buffer);
    buffer.delete();
    return result;
  };

  /// createTextureFromKtx1 ::method:: Utility function that creates a [Texture] from a KTX1 file.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with KTX1 file contents
  /// options ::argument:: Options dictionary.
  /// ::retval:: [Texture]
  CTEngine.Engine.prototype.createTextureFromKtx1 = function (buffer, options) {
    buffer = getBufferDescriptor(buffer);
    const result = CTEngine._createTextureFromKtx1(buffer, this, options);
    buffer.delete();
    return result;
  };

  /// createTextureFromKtx2 ::method:: Utility function that creates a [Texture] from a KTX2 file.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with KTX2 file contents
  /// options ::argument:: Options dictionary.
  /// ::retval:: [Texture]
  CTEngine.Engine.prototype.createTextureFromKtx2 = function (buffer, options) {
    options = options || {};
    buffer = getBufferDescriptor(buffer);

    const engine = this;
    const quiet = false;
    const reader = new CTEngine.Ktx2Reader(engine, quiet);

    reader.requestFormat(CTEngine.Texture$InternalFormat.RGBA8);
    reader.requestFormat(CTEngine.Texture$InternalFormat.SRGB8_A8);

    const formats = options.formats || [];
    for (const format of formats) {
      reader.requestFormat(format);
    }

    result = reader.load(
      buffer,
      options.srgb
        ? CTEngine.Ktx2Reader$TransferFunction.sRGB
        : CTEngine.Ktx2Reader$TransferFunction.LINEAR
    );

    reader.delete();
    buffer.delete();
    return result;
  };

  /// createIblFromKtx1 ::method:: Utility that creates an [IndirectLight] from a KTX file.
  /// NOTE: To prevent a leak, please be sure to destroy the associated reflections texture.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with KTX file contents
  /// options ::argument:: Options dictionary.
  /// ::retval:: [IndirectLight]
  CTEngine.Engine.prototype.createIblFromKtx1 = function (buffer, options) {
    buffer = getBufferDescriptor(buffer);
    const result = CTEngine._createIblFromKtx1(buffer, this, options);
    buffer.delete();
    return result;
  };

  /// createSkyFromKtx1 ::method:: Utility function that creates a [Skybox] from a KTX file.
  /// NOTE: To prevent a leak, please be sure to destroy the associated texture.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with KTX file contents
  /// options ::argument:: Options dictionary.
  /// ::retval:: [Skybox]
  CTEngine.Engine.prototype.createSkyFromKtx1 = function (buffer, options) {
    const skytex = this.createTextureFromKtx1(buffer, options);
    return CTEngine.Skybox.Builder().environment(skytex).build(this);
  };

  /// createTextureFromPng ::method:: Creates a 2D [Texture] from the raw contents of a PNG file.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with PNG file contents
  /// options ::argument:: object with optional `srgb`, `noalpha`, and `nomips` keys.
  /// ::retval:: [Texture]
  CTEngine.Engine.prototype.createTextureFromPng = function (buffer, options) {
    buffer = getBufferDescriptor(buffer);
    const result = CTEngine._createTextureFromImageFile(buffer, this, options);
    buffer.delete();
    return result;
  };

  /// createTextureFromJpeg ::method:: Creates a 2D [Texture] from the contents of a JPEG file.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with JPEG file contents
  /// options ::argument:: JavaScript object with optional `srgb` and `nomips` keys.
  /// ::retval:: [Texture]
  CTEngine.Engine.prototype.createTextureFromJpeg = function (buffer, options) {
    buffer = getBufferDescriptor(buffer);
    const result = CTEngine._createTextureFromImageFile(buffer, this, options);
    buffer.delete();
    return result;
  };

  /// loadFilamesh ::method:: Consumes the contents of a filamesh file and creates a renderable.
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer] with filamesh contents
  /// definstance ::argument:: Optional default [MaterialInstance]
  /// matinstances ::argument:: Optional in-out object that gets populated with a \
  /// name-to-[MaterialInstance] mapping. Clients can also optionally provide individual \
  /// material instances using this argument.
  /// ::retval:: JavaScript object with keys `renderable`, `vertexBuffer`, and `indexBuffer`. \
  /// These are of type [Entity], [VertexBuffer], and [IndexBuffer].
  CTEngine.Engine.prototype.loadFilamesh = function (
    buffer,
    definstance,
    matinstances
  ) {
    buffer = getBufferDescriptor(buffer);
    const result = CTEngine._loadFilamesh(
      this,
      buffer,
      definstance,
      matinstances
    );
    buffer.delete();
    return result;
  };

  /// createAssetLoader ::method::
  /// ::retval:: an instance of [AssetLoader]
  /// Clients should create only one asset loader for the lifetime of their app, this prevents
  /// memory leaks and duplication of Material objects.
  CTEngine.Engine.prototype.createAssetLoader = function () {
    const materials = new CTEngine.gltfio$UbershaderProvider(this);
    return new CTEngine.gltfio$AssetLoader(this, materials);
  };

  /// addEntities ::method::
  /// entities ::argument:: array of entities
  /// This method is equivalent to calling `addEntity` on each item in the array.
  CTEngine.Scene.prototype.addEntities = function (entities) {
    const vector = new CTEngine.EntityVector();
    for (const entity of entities) {
      vector.push_back(entity);
    }
    this._addEntities(vector);
  };

  /// removeEntities ::method::
  /// entities ::argument:: array of entities
  /// This method is equivalent to calling `remove` on each item in the array.
  CTEngine.Scene.prototype.removeEntities = function (entities) {
    const vector = new CTEngine.EntityVector();
    for (const entity of entities) {
      vector.push_back(entity);
    }
    this._removeEntities(vector);
  };

  /// setShadowOptions ::method::
  /// instance ::argument:: Instance of a light component obtained from `getInstance`.
  /// overrides ::argument:: Dictionary with one or more of the following properties: \
  /// mapSize, shadowCascades, constantBias, normalBias, shadowFar, shadowNearHint, \
  /// shadowFarHint, stable, polygonOffsetConstant, polygonOffsetSlope, \
  // screenSpaceContactShadows, stepCount, maxShadowDistance.
  CTEngine.LightManager.prototype.setShadowOptions = function (
    instance,
    overrides
  ) {
    this._setShadowOptions(instance, CTEngine.shadowOptions(overrides));
  };

  /// setClearOptions ::method::
  /// overrides ::argument:: Dictionary with one or more of the following properties: \
  /// clearColor, clear, discard.
  CTEngine.Renderer.prototype.setClearOptions = function (overrides) {
    const options = {
      clearColor: [0, 0, 0, 0],
      clear: false,
      discard: true,
    };
    Object.assign(options, overrides);
    this._setClearOptions(options);
  };

  /// setAmbientOcclusionOptions ::method::
  CTEngine.View.prototype.setAmbientOcclusionOptions = function (overrides) {
    const options = this.setAmbientOcclusionOptionsDefaults(overrides);
    this._setAmbientOcclusionOptions(options);
  };

  /// setDepthOfFieldOptions ::method::
  CTEngine.View.prototype.setDepthOfFieldOptions = function (overrides) {
    const options = this.setDepthOfFieldOptionsDefaults(overrides);
    this._setDepthOfFieldOptions(options);
  };

  /// setMultiSampleAntiAliasingOptions ::method::
  CTEngine.View.prototype.setMultiSampleAntiAliasingOptions = function (
    overrides
  ) {
    const options = this.setMultiSampleAntiAliasingOptionsDefaults(overrides);
    this._setMultiSampleAntiAliasingOptions(options);
  };

  /// setTemporalAntiAliasingOptions ::method::
  CTEngine.View.prototype.setTemporalAntiAliasingOptions = function (
    overrides
  ) {
    const options = this.setTemporalAntiAliasingOptionsDefaults(overrides);
    this._setTemporalAntiAliasingOptions(options);
  };

  /// setScreenSpaceReflectionsOptions ::method::
  CTEngine.View.prototype.setScreenSpaceReflectionsOptions = function (
    overrides
  ) {
    const options = this.setScreenSpaceReflectionsOptionsDefaults(overrides);
    this._setScreenSpaceReflectionsOptions(options);
  };

  /// setBloomOptions ::method::
  CTEngine.View.prototype.setBloomOptions = function (overrides) {
    const options = this.setBloomOptionsDefaults(overrides);
    this._setBloomOptions(options);
  };

  /// setFogOptions ::method::
  CTEngine.View.prototype.setFogOptions = function (overrides) {
    const options = this.setFogOptionsDefaults(overrides);
    this._setFogOptions(options);
  };

  /// setVignetteOptions ::method::
  CTEngine.View.prototype.setVignetteOptions = function (overrides) {
    const options = this.setVignetteOptionsDefaults(overrides);
    this._setVignetteOptions(options);
  };

  /// setGuardBandOptions ::method::
  CTEngine.View.prototype.setGuardBandOptions = function (overrides) {
    const options = this.setGuardBandOptionsDefaults(overrides);
    this._setGuardBandOptions(options);
  };

  /// BufferObject ::core class::

  /// setBuffer ::method::
  /// engine ::argument:: [Engine]
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer]
  /// byteOffset ::argument:: non-negative integer
  CTEngine.BufferObject.prototype.setBuffer = function (
    engine,
    buffer,
    byteOffset = 0
  ) {
    buffer = getBufferDescriptor(buffer);
    this._setBuffer(engine, buffer, byteOffset);
    buffer.delete();
  };

  /// VertexBuffer ::core class::

  /// setBufferAt ::method::
  /// engine ::argument:: [Engine]
  /// bufferIndex ::argument:: non-negative integer
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer]
  /// byteOffset ::argument:: non-negative integer
  CTEngine.VertexBuffer.prototype.setBufferAt = function (
    engine,
    bufferIndex,
    buffer,
    byteOffset = 0
  ) {
    buffer = getBufferDescriptor(buffer);
    this._setBufferAt(engine, bufferIndex, buffer, byteOffset);
    buffer.delete();
  };

  /// IndexBuffer ::core class::

  /// setBuffer ::method::
  /// engine ::argument:: [Engine]
  /// buffer ::argument:: asset string, or Uint8Array, or [Buffer]
  /// byteOffset ::argument:: non-negative integer
  CTEngine.IndexBuffer.prototype.setBuffer = function (
    engine,
    buffer,
    byteOffset = 0
  ) {
    buffer = getBufferDescriptor(buffer);
    this._setBuffer(engine, buffer, byteOffset);
    buffer.delete();
  };

  CTEngine.LightManager$Builder.prototype.shadowOptions = function (overrides) {
    return this._shadowOptions(CTEngine.shadowOptions(overrides));
  };

  CTEngine.RenderableManager$Builder.prototype.build =
    CTEngine.LightManager$Builder.prototype.build = function (engine, entity) {
      const result = this._build(engine, entity);
      this.delete();
      return result;
    };

  CTEngine.ColorGrading$Builder.prototype.build =
    CTEngine.RenderTarget$Builder.prototype.build =
    CTEngine.VertexBuffer$Builder.prototype.build =
    CTEngine.IndexBuffer$Builder.prototype.build =
    CTEngine.Texture$Builder.prototype.build =
    CTEngine.IndirectLight$Builder.prototype.build =
    CTEngine.Skybox$Builder.prototype.build =
      function (engine) {
        const result = this._build(engine);
        this.delete();
        return result;
      };

  CTEngine.Ktx1Bundle.prototype.getBlob = function (index) {
    const blob = this._getBlob(index);
    const result = blob.getBytes();
    blob.delete();
    return result;
  };

  CTEngine.Ktx1Bundle.prototype.getCubeBlob = function (miplevel) {
    const blob = this._getCubeBlob(miplevel);
    const result = blob.getBytes();
    blob.delete();
    return result;
  };

  CTEngine.Texture.prototype.setImage = function (engine, level, pbd) {
    this._setImage(engine, level, pbd);
    pbd.delete();
  };

  CTEngine.Texture.prototype.setImageCube = function (engine, level, pbd) {
    this._setImageCube(engine, level, pbd);
    pbd.delete();
  };

  CTEngine.Texture.prototype.getWidth = function (engine, level = 0) {
    return this._getWidth(engine, level);
  };

  CTEngine.Texture.prototype.getHeight = function (engine, level = 0) {
    return this._getHeight(engine, level);
  };

  CTEngine.Texture.prototype.getDepth = function (engine, level = 0) {
    return this._getDepth(engine, level);
  };

  CTEngine.Texture.prototype.getLevels = function (engine) {
    return this._getLevels(engine);
  };

  CTEngine.SurfaceOrientation$Builder.prototype.normals = function (
    buffer,
    stride = 0
  ) {
    buffer = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    this.norPointer = CTEngine._malloc(buffer.byteLength);
    CTEngine.HEAPU8.set(buffer, this.norPointer);
    this._normals(this.norPointer, stride);
  };

  CTEngine.SurfaceOrientation$Builder.prototype.uvs = function (
    buffer,
    stride = 0
  ) {
    buffer = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    this.uvsPointer = CTEngine._malloc(buffer.byteLength);
    CTEngine.HEAPU8.set(buffer, this.uvsPointer);
    this._uvs(this.uvsPointer, stride);
  };

  CTEngine.SurfaceOrientation$Builder.prototype.positions = function (
    buffer,
    stride = 0
  ) {
    buffer = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    this.posPointer = CTEngine._malloc(buffer.byteLength);
    CTEngine.HEAPU8.set(buffer, this.posPointer);
    this._positions(this.posPointer, stride);
  };

  CTEngine.SurfaceOrientation$Builder.prototype.triangles16 = function (
    buffer
  ) {
    buffer = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    this.t16Pointer = CTEngine._malloc(buffer.byteLength);
    CTEngine.HEAPU8.set(buffer, this.t16Pointer);
    this._triangles16(this.t16Pointer);
  };

  CTEngine.SurfaceOrientation$Builder.prototype.triangles32 = function (
    buffer
  ) {
    buffer = new Uint8Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
    this.t32Pointer = CTEngine._malloc(buffer.byteLength);
    CTEngine.HEAPU8.set(buffer, this.t32Pointer);
    this._triangles32(this.t32Pointer);
  };

  CTEngine.SurfaceOrientation$Builder.prototype.build = function () {
    const result = this._build();
    this.delete();
    if ("norPointer" in this) CTEngine._free(this.norPointer);
    if ("uvsPointer" in this) CTEngine._free(this.uvsPointer);
    if ("posPointer" in this) CTEngine._free(this.posPointer);
    if ("t16Pointer" in this) CTEngine._free(this.t16Pointer);
    if ("t32Pointer" in this) CTEngine._free(this.t32Pointer);
    return result;
  };

  CTEngine.SurfaceOrientation.prototype.getQuats = function (nverts) {
    const attribType = CTEngine.VertexBuffer$AttributeType.SHORT4;
    const quatsBufferSize = 8 * nverts;
    const quatsBuffer = CTEngine._malloc(quatsBufferSize);
    this._getQuats(quatsBuffer, nverts, attribType);
    const arrayBuffer = CTEngine.HEAPU8.subarray(
      quatsBuffer,
      quatsBuffer + quatsBufferSize
    ).slice().buffer;
    CTEngine._free(quatsBuffer);
    return new Int16Array(arrayBuffer);
  };

  CTEngine.SurfaceOrientation.prototype.getQuatsHalf4 = function (nverts) {
    const attribType = CTEngine.VertexBuffer$AttributeType.HALF4;
    const quatsBufferSize = 8 * nverts;
    const quatsBuffer = CTEngine._malloc(quatsBufferSize);
    this._getQuats(quatsBuffer, nverts, attribType);
    const arrayBuffer = CTEngine.HEAPU8.subarray(
      quatsBuffer,
      quatsBuffer + quatsBufferSize
    ).slice().buffer;
    CTEngine._free(quatsBuffer);
    return new Uint16Array(arrayBuffer);
  };

  CTEngine.SurfaceOrientation.prototype.getQuatsFloat4 = function (nverts) {
    const attribType = CTEngine.VertexBuffer$AttributeType.FLOAT4;
    const quatsBufferSize = 16 * nverts;
    const quatsBuffer = CTEngine._malloc(quatsBufferSize);
    this._getQuats(quatsBuffer, nverts, attribType);
    const arrayBuffer = CTEngine.HEAPU8.subarray(
      quatsBuffer,
      quatsBuffer + quatsBufferSize
    ).slice().buffer;
    CTEngine._free(quatsBuffer);
    return new Float32Array(arrayBuffer);
  };

  CTEngine.gltfio$AssetLoader.prototype.createAsset = function (buffer) {
    buffer = getBufferDescriptor(buffer);
    const result = this._createAsset(buffer);
    buffer.delete();
    return result;
  };
  CTEngine.gltfio$FileLoader.prototype.loadFile = function (
    buffer,
    buffername
  ) {
    buffer = getBufferDescriptor(buffer);
    const result = this._loadFile(buffer, buffername);
    buffer.delete();
    return result;
  };

  CTEngine.gltfio$AssetLoader.prototype.createInstancedAsset = function (
    buffer,
    instances
  ) {
    buffer = getBufferDescriptor(buffer);
    const asset = this._createInstancedAsset(buffer, instances.length);
    buffer.delete();
    const instancesVector = asset._getAssetInstances();
    for (let i = 0; i < instancesVector.size(); i++) {
      instances[i] = instancesVector.get(i);
    }
    return asset;
  };

  // See the C++ documentation for ResourceLoader and AssetLoader. The JavaScript API differs in
  // that it takes two optional callbacks:
  //
  // - onDone is called after all resources have been downloaded and decoded.
  // - onFetched is called after each resource has finished downloading.
  //
  // Takes an optional base path for resolving the URI strings in the glTF file, which is
  // typically the path to the parent glTF file. The given base path cannot itself be a relative
  // URL, but clients can do the following to resolve a relative URL:
  //    const basePath = '' + new URL(myRelativeUrl, document.location);
  // If the given base path is null, document.location is used as the base.
  //
  // The optional asyncInterval argument allows clients to control how decoding is amortized
  // over time. It represents the number of milliseconds between each texture decoding task.
  //
  // The optional config argument is an object with boolean field `normalizeSkinningWeights`.
  CTEngine.gltfio$CTEngineAsset.prototype.loadResources = function (
    onDone,
    onFetched,
    basePath,
    asyncInterval,
    config
  ) {
    const asset = this;
    const engine = this.getEngine();
    const interval = asyncInterval || 30;
    const defaults = {
      normalizeSkinningWeights: true,
    };
    config = Object.assign(defaults, config || {});

    basePath = basePath || document.location;
    onFetched = onFetched || ((name) => {});
    onDone = onDone || (() => {});

    // Construct two lists of URI strings to fetch: textures and non-textures.
    let textureUris = new Set();
    let bufferUris = new Set();
    const absoluteToRelativeUri = {};
    for (const relativeUri of this.getResourceUris()) {
      const absoluteUri = "" + new URL(relativeUri, basePath);
      absoluteToRelativeUri[absoluteUri] = relativeUri;
      if (isTexture(relativeUri)) {
        textureUris.add(absoluteUri);
        continue;
      }
      bufferUris.add(absoluteUri);
      //console.log("absolutepath",absoluteUri);
    }
    textureUris = Array.from(textureUris);
    bufferUris = Array.from(bufferUris);

    // Construct a resource loader and start decoding after all textures are fetched.
    const resourceLoader = new CTEngine.gltfio$ResourceLoader(
      engine,
      config.normalizeSkinningWeights
    );

    const stbProvider = new CTEngine.gltfio$StbProvider(engine);
    const ktx2Provider = new CTEngine.gltfio$Ktx2Provider(engine);

    resourceLoader.addStbProvider("image/jpeg", stbProvider);
    resourceLoader.addStbProvider("image/png", stbProvider);
    resourceLoader.addKtx2Provider("image/ktx2", ktx2Provider);

    const onComplete = () => {
      resourceLoader.asyncBeginLoad(asset);

      // NOTE: This decodes in the wasm layer instead of using Canvas2D, which allows CTEngine
      // to have more control (handling of alpha, srgb, etc) and improves parity with native
      // platforms. In the future we may wish to offload this to web workers.

      // Decode a single PNG or JPG every 30 milliseconds, or at the specified interval.
      const timer = setInterval(() => {
        resourceLoader.asyncUpdateLoad();
        const progress = resourceLoader.asyncGetLoadProgress();
        if (progress >= 1) {
          clearInterval(timer);
          resourceLoader.delete();
          stbProvider.delete();
          onDone();
        }
      }, interval);
    };

    // Download all non-texture resources and invoke the callback when done.
    if (bufferUris.length == 0) {
      onComplete();
    } else {
      CTEngine.fetch(bufferUris, onComplete, function (absoluteUri) {
        const buffer = getBufferDescriptor(absoluteUri);
        const relativeUri = absoluteToRelativeUri[absoluteUri];
        resourceLoader.addResourceData(relativeUri, buffer);
        buffer.delete();
        onFetched(relativeUri);
      });
    }

    // Begin downloading all texture resources, no completion callback necessary.
    CTEngine.fetch(textureUris, null, function (absoluteUri) {
      const buffer = getBufferDescriptor(absoluteUri);
      const relativeUri = absoluteToRelativeUri[absoluteUri];
      resourceLoader.addResourceData(relativeUri, buffer);
      buffer.delete();
      onFetched(relativeUri);
    });
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getEntities = function () {
    return CTEngine.vectorToArray(this._getEntities());
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getEntitiesByName = function (name) {
    return CTEngine.vectorToArray(this._getEntitiesByName(name));
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getEntitiesByPrefix = function (
    prefix
  ) {
    return CTEngine.vectorToArray(this._getEntitiesByPrefix(prefix));
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getLightEntities = function () {
    return CTEngine.vectorToArray(this._getLightEntities());
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getRenderableEntities = function () {
    return CTEngine.vectorToArray(this._getRenderableEntities());
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getCameraEntities = function () {
    return CTEngine.vectorToArray(this._getCameraEntities());
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getResourceUris = function () {
    return CTEngine.vectorToArray(this._getResourceUris());
  };

  CTEngine.gltfio$CTEngineAsset.prototype.getAssetInstances = function () {
    return CTEngine.vectorToArray(this._getAssetInstances());
  };

  CTEngine.gltfio$CTEngineInstance.prototype.getMaterialVariantNames =
    function () {
      return CTEngine.vectorToArray(this._getMaterialVariantNames());
    };
  return CTEngine;
};

/*
 * Copyright (C) 2019 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ---------------
// Buffer Wrappers
// ---------------

// These wrappers make it easy for JavaScript clients to pass large swaths of data to CTEngine. They
// copy the contents of the given typed array into the WASM heap, then return a low-level buffer
// descriptor object. If the given array was taken from the WASM heap, then they create a temporary
// copy because the input pointer becomes invalidated after allocating heap memory for the buffer
// descriptor.

/// Buffer ::function:: Constructs a [BufferDescriptor] by copying a typed array into the WASM heap.
/// typedarray ::argument:: Data to consume (e.g. Uint8Array, Uint16Array, Float32Array)
/// ::retval:: [BufferDescriptor]
CTEngine.Buffer = function (typedarray) {
  console.assert(typedarray.buffer instanceof ArrayBuffer);
  console.assert(typedarray.byteLength > 0);

  // The only reason we need to create a copy here is that emscripten might "grow" its entire heap
  // (i.e. destroy and recreate) during the allocation of the BufferDescriptor, which would cause
  // detachment if the source array happens to be view into the old emscripten heap.
  const ta = typedarray.slice();

  const bd = new CTEngine.driver$BufferDescriptor(ta.byteLength);
  const uint8array = new Uint8Array(ta.buffer, ta.byteOffset, ta.byteLength);

  // getBytes() returns a view into the emscripten heap, this just does a memcpy into it.
  bd.getBytes().set(uint8array);

  return bd;
};

/// PixelBuffer ::function:: Constructs a [PixelBufferDescriptor] by copying a typed array into \
/// the WASM heap.
/// typedarray ::argument:: Data to consume (e.g. Uint8Array, Uint16Array, Float32Array)
/// format ::argument:: [PixelDataFormat]
/// datatype ::argument:: [PixelDataType]
/// ::retval:: [PixelBufferDescriptor]
CTEngine.PixelBuffer = function (typedarray, format, datatype) {
  console.assert(typedarray.buffer instanceof ArrayBuffer);
  console.assert(typedarray.byteLength > 0);
  const ta = typedarray.slice();
  const bd = new CTEngine.driver$PixelBufferDescriptor(
    ta.byteLength,
    format,
    datatype
  );
  const uint8array = new Uint8Array(ta.buffer, ta.byteOffset, ta.byteLength);
  bd.getBytes().set(uint8array);
  return bd;
};

/// CompressedPixelBuffer ::function:: Constructs a [PixelBufferDescriptor] for compressed texture
/// data by copying a typed array into the WASM heap.
/// typedarray ::argument:: Data to consume (e.g. Uint8Array, Uint16Array, Float32Array)
/// cdatatype ::argument:: [CompressedPixelDataType]
/// faceSize ::argument:: Number of bytes in each face (cubemaps only)
/// ::retval:: [PixelBufferDescriptor]
CTEngine.CompressedPixelBuffer = function (typedarray, cdatatype, faceSize) {
  console.assert(typedarray.buffer instanceof ArrayBuffer);
  console.assert(typedarray.byteLength > 0);
  faceSize = faceSize || typedarray.byteLength;
  const ta = typedarray.slice();
  const bd = new CTEngine.driver$PixelBufferDescriptor(
    ta.byteLength,
    cdatatype,
    faceSize,
    true
  );
  const uint8array = new Uint8Array(ta.buffer, ta.byteOffset, ta.byteLength);
  bd.getBytes().set(uint8array);
  return bd;
};

CTEngine._loadFilamesh = function (engine, buffer, definstance, matinstances) {
  matinstances = matinstances || {};
  const registry = new CTEngine.MeshReader$MaterialRegistry();
  for (let key in matinstances) {
    registry.set(key, matinstances[key]);
  }
  if (definstance) {
    registry.set("DefaultMaterial", definstance);
  }
  const mesh = CTEngine.MeshReader.loadMeshFromBuffer(engine, buffer, registry);
  const keys = registry.keys();
  for (let i = 0; i < keys.size(); i++) {
    const key = keys.get(i);
    const minstance = registry.get(key);
    matinstances[key] = minstance;
  }
  return {
    renderable: mesh.renderable(),
    vertexBuffer: mesh.vertexBuffer(),
    indexBuffer: mesh.indexBuffer(),
  };
};

// ------------------
// Geometry Utilities
// ------------------

/// IcoSphere ::class:: Utility class for constructing spheres (requires glMatrix).
///
/// The constructor takes an integer subdivision level, with 0 being an icosahedron.
///
/// Exposes three arrays as properties:
///
/// - `icosphere.vertices` Float32Array of XYZ coordinates.
/// - `icosphere.tangents` Uint16Array (interpreted as half-floats) encoding the surface orientation
/// as quaternions.
/// - `icosphere.triangles` Uint16Array with triangle indices.
///
CTEngine.IcoSphere = function (nsubdivs) {
  const X = 0.525731112119133606;
  const Z = 0.850650808352039932;
  const N = 0;
  this.vertices = new Float32Array([
    -X,
    +N,
    +Z,
    +X,
    +N,
    +Z,
    -X,
    +N,
    -Z,
    +X,
    +N,
    -Z,
    +N,
    +Z,
    +X,
    +N,
    +Z,
    -X,
    +N,
    -Z,
    +X,
    +N,
    -Z,
    -X,
    +Z,
    +X,
    +N,
    -Z,
    +X,
    +N,
    +Z,
    -X,
    +N,
    -Z,
    -X,
    +N,
  ]);
  this.triangles = new Uint16Array([
    1, 4, 0, 4, 9, 0, 4, 5, 9, 8, 5, 4, 1, 8, 4, 1, 10, 8, 10, 3, 8, 8, 3, 5, 3,
    2, 5, 3, 7, 2, 3, 10, 7, 10, 6, 7, 6, 11, 7, 6, 0, 11, 6, 1, 0, 10, 1, 6,
    11, 0, 9, 2, 11, 9, 5, 2, 9, 11, 2, 7,
  ]);

  nsubdivs = nsubdivs || 0;
  while (nsubdivs-- > 0) {
    this.subdivide();
  }

  const nverts = this.vertices.length / 3;

  // This is a unit sphere, so normals = positions.
  const normals = this.vertices;

  // Perform computations.
  const sob = new CTEngine.SurfaceOrientation$Builder();
  sob.vertexCount(nverts);
  sob.normals(normals, 0);
  const orientation = sob.build();

  // Copy the results out of the helper.
  this.tangents = orientation.getQuats(nverts);

  // Free up the surface orientation helper now that we're done with it.
  orientation.delete();
};

CTEngine.IcoSphere.prototype.subdivide = function () {
  const srctris = this.triangles;
  const srcverts = this.vertices;
  const nsrctris = srctris.length / 3;
  const ndsttris = nsrctris * 4;
  const nsrcverts = srcverts.length / 3;
  const ndstverts = nsrcverts + nsrctris * 3;
  const dsttris = new Uint16Array(ndsttris * 3);
  const dstverts = new Float32Array(ndstverts * 3);
  dstverts.set(srcverts);
  let srcind = 0,
    dstind = 0,
    i3 = nsrcverts * 3,
    i4 = i3 + 3,
    i5 = i4 + 3;
  for (let tri = 0; tri < nsrctris; tri++, i3 += 9, i4 += 9, i5 += 9) {
    const i0 = srctris[srcind++] * 3;
    const i1 = srctris[srcind++] * 3;
    const i2 = srctris[srcind++] * 3;
    const v0 = srcverts.subarray(i0, i0 + 3);
    const v1 = srcverts.subarray(i1, i1 + 3);
    const v2 = srcverts.subarray(i2, i2 + 3);
    const v3 = dstverts.subarray(i3, i3 + 3);
    const v4 = dstverts.subarray(i4, i4 + 3);
    const v5 = dstverts.subarray(i5, i5 + 3);
    vec3.normalize(v3, vec3.add(v3, v0, v1));
    vec3.normalize(v4, vec3.add(v4, v1, v2));
    vec3.normalize(v5, vec3.add(v5, v2, v0));
    dsttris[dstind++] = i0 / 3;
    dsttris[dstind++] = i3 / 3;
    dsttris[dstind++] = i5 / 3;
    dsttris[dstind++] = i3 / 3;
    dsttris[dstind++] = i1 / 3;
    dsttris[dstind++] = i4 / 3;
    dsttris[dstind++] = i5 / 3;
    dsttris[dstind++] = i3 / 3;
    dsttris[dstind++] = i4 / 3;
    dsttris[dstind++] = i2 / 3;
    dsttris[dstind++] = i5 / 3;
    dsttris[dstind++] = i4 / 3;
  }
  this.triangles = dsttris;
  this.vertices = dstverts;
};

// ---------------
// Math Extensions
// ---------------

function clamp(v, least, most) {
  return Math.max(Math.min(most, v), least);
}

/// packSnorm16 ::function:: Converts a float in [-1, +1] into a half-float.
/// value ::argument:: float
/// ::retval:: half-float
CTEngine.packSnorm16 = function (value) {
  return Math.round(clamp(value, -1.0, 1.0) * 32767.0);
};

/// loadMathExtensions ::function:: Extends the [glMatrix](http://glmatrix.net/) math library.
/// CTEngine does not require its clients to use glMatrix, but if its usage is detected then
/// the [init] function will automatically call `loadMathExtensions`.
/// This defines the following functions:
/// - **vec4.packSnorm16** can be used to create half-floats (see [packSnorm16])
/// - **mat3.fromRotation** now takes an arbitrary axis
CTEngine.loadMathExtensions = function () {
  vec4.packSnorm16 = function (out, src) {
    out[0] = CTEngine.packSnorm16(src[0]);
    out[1] = CTEngine.packSnorm16(src[1]);
    out[2] = CTEngine.packSnorm16(src[2]);
    out[3] = CTEngine.packSnorm16(src[3]);
    return out;
  };
  // In gl-matrix, mat3 rotation assumes rotation about the Z axis, so here we add a function
  // to allow an arbitrary axis.
  const fromRotationZ = mat3.fromRotation;
  mat3.fromRotation = function (out, radians, axis) {
    if (axis) {
      return mat3.fromMat4(
        out,
        mat4.fromRotation(mat4.create(), radians, axis)
      );
    }
    return fromRotationZ(out, radians);
  };
};

// ---------------
// Texture helpers
// ---------------

CTEngine._createTextureFromKtx1 = function (ktxdata, engine, options) {
  options = options || {};
  const ktx = options["ktx"] || new CTEngine.Ktx1Bundle(ktxdata);
  const srgb = !!options["srgb"];
  return CTEngine.ktx1reader$createTexture(engine, ktx, srgb);
};

CTEngine._createIblFromKtx1 = function (ktxdata, engine, options) {
  options = options || {};
  const iblktx = (options["ktx"] = new CTEngine.Ktx1Bundle(ktxdata));

  const format = iblktx.info().glInternalFormat;
  //if (format != this.ctx.R11F_G11F_B10F && format != this.ctx.RGB16F && format != this.ctx.RGB32F) {
  if (format != 35898 && format != 33327 && format != 34837) {
    console.warn(
      "IBL texture format is 0x" +
        format.toString(16) +
        " which is not an expected floating-point format. Please use cmgen to generate IBL."
    );
  }

  const ibltex = CTEngine._createTextureFromKtx1(ktxdata, engine, options);
  const shstring = iblktx.getMetadata("sh");
  const ibl = CTEngine.IndirectLight.Builder()
    .reflections(ibltex)
    .build(engine);
  ibl.shfloats = shstring.split(/\s/, 9 * 3).map(parseFloat);
  return ibl;
};

CTEngine._createTextureFromImageFile = function (
  fileContents,
  engine,
  options
) {
  const Sampler = CTEngine.Texture$Sampler;
  const TextureFormat = CTEngine.Texture$InternalFormat;
  const PixelDataFormat = CTEngine.PixelDataFormat;

  options = options || {};
  const srgb = !!options["srgb"];
  const noalpha = !!options["noalpha"];
  const nomips = !!options["nomips"];

  const decodedImage = CTEngine.decodeImage(fileContents, noalpha ? 3 : 4);

  let texformat, pbformat, pbtype;
  if (noalpha) {
    texformat = srgb ? TextureFormat.SRGB8 : TextureFormat.RGB8;
    pbformat = PixelDataFormat.RGB;
    pbtype = CTEngine.PixelDataType.UBYTE;
  } else {
    texformat = srgb ? TextureFormat.SRGB8_A8 : TextureFormat.RGBA8;
    pbformat = PixelDataFormat.RGBA;
    pbtype = CTEngine.PixelDataType.UBYTE;
  }

  const tex = CTEngine.Texture.Builder()
    .width(decodedImage.width)
    .height(decodedImage.height)
    .levels(nomips ? 1 : 0xff)
    .sampler(Sampler.SAMPLER_2D)
    .format(texformat)
    .build(engine);

  const pixelbuffer = CTEngine.PixelBuffer(
    decodedImage.data.getBytes(),
    pbformat,
    pbtype
  );
  tex.setImage(engine, 0, pixelbuffer);
  if (!nomips) {
    tex.generateMipmaps(engine);
  }
  return tex;
};

/// getSupportedFormats ::function:: Queries WebGL to check which compressed formats are supported.
/// ::retval:: object with boolean values and the following keys: s3tc, astc, etc
CTEngine.getSupportedFormats = function () {
  if (CTEngine.supportedFormats) {
    return CTEngine.supportedFormats;
  }
  const options = { majorVersion: 2, minorVersion: 0 };
  var canvas = wx.createCanvas();
  var ctx = canvas.getContext("webgl2", options);

  const result = {
    s3tc: false,
    s3tc_srgb: false,
    astc: false,
    etc: false,
  };
  let exts = ctx.getSupportedExtensions(),
    nexts = exts.length,
    i;
  for (i = 0; i < nexts; i++) {
    let ext = exts[i];
    if (ext == "WEBGL_compressed_texture_s3tc") {
      result.s3tc = true;
    } else if (ext == "WEBGL_compressed_texture_s3tc_srgb") {
      result.s3tc_srgb = true;
    } else if (ext == "WEBGL_compressed_texture_astc") {
      result.astc = true;
    } else if (ext == "WEBGL_compressed_texture_etc") {
      result.etc = true;
    }
  }
  return (CTEngine.supportedFormats = result);
};

/// getSupportedFormatSuffix ::function:: Generate a file suffix according to the texture format.
/// Consumes a string describing desired formats and produces a file suffix depending on
/// which (if any) of the formats are actually supported by the WebGL implementation. This is
/// useful for compressed textures. For example, some platforms accept ETC and others accept S3TC.
/// desiredFormats ::argument:: space-delimited string of desired formats
/// ::retval:: empty string if there is no intersection of supported and desired formats.
CTEngine.getSupportedFormatSuffix = function (desiredFormats) {
  desiredFormats = desiredFormats.split(" ");
  let exts = CTEngine.getSupportedFormats();
  for (let key in exts) {
    if (exts[key] && desiredFormats.includes(key)) {
      return "_" + key;
    }
  }
  return "";
};
