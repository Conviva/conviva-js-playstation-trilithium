/*! (C) 2020 Conviva, Inc. All rights reserved. Confidential and proprietary. */
!function(a,b){if("function"==typeof define&&define.amd?define(b):"object"==typeof exports&&(module.exports=b()),void 0!==a)if(void 0===a.Conviva){if(void 0!==a.ConvivaModule)return
;if(a.ConvivaModuleLoading)return;a.ConvivaModuleLoading=!0,a.ConvivaModule=b(),delete a.ConvivaModuleLoading}else{if(void 0!==a.Conviva.ProxyMonitor)return;if(a.ConvivaModuleLoading)return;var c=b()
;a.ConvivaModuleLoading=!0,a.Conviva.ProxyMonitor=c.ProxyMonitor,a.Conviva.Impl.TrilithiumProxy=c.Impl.TrilithiumProxy,delete a.ConvivaModuleLoading}}(this,function(){var a={};return function(){
"use strict";!function(){a.ProxyMonitor={_proxyMonitor:null,release:function(){null!=this._proxyMonitor&&this._proxyMonitor.cleanup()},initConvivaDropIn:function(b,c,d,e){
var f="No player proxy initialized";if(null!==b)return this._proxyMonitor=new a.Impl.TrilithiumProxy(b,c,d,e),this._proxyMonitor;throw new Error(f)}};a.Impl=a.Impl||{}
;var b=a.Impl.TrilithiumProxy=function(a,c,d,e){function f(a,c,d,e){if(!a)throw new Error("TrilithiumProxy: _video argument cannot be null.");this._video=a,this._videoAnalytics=d,
this._loggingInterface=c.buildLogger(),this._timerInterface=c.buildTimer(),this._loggingInterface.setModuleName("TrilithiumProxy"),this._log("TrilithiumProxy._constr()");var f={}
;f[e.Constants.DeviceMetadata.TYPE]=e.Constants.DeviceType.CONSOLE,f[e.Constants.DeviceMetadata.CATEGORY]=e.Constants.DeviceCategory.PLAYSTATION;var g={};g[e.Constants.MODULE_NAME]="Trilithium",
g[e.Constants.MODULE_VERSION]=b.version,this._videoAnalytics.setContentInfo(g);var h={};if(h[e.Constants.FRAMEWORK_NAME]="Trilithium","undefined"!=typeof engine){
h[e.Constants.FRAMEWORK_VERSION]=engine.stats.version.join(".");var i=engine.stats.device.platform;void 0!==i&&null!==i&&(f[e.Constants.DeviceMetadata.MODEL]=i)}e.Analytics.setDeviceMetadata(f),
this._videoAnalytics.setPlayerInfo(h),this._setAllEventListeners(),this._startPolling()}var g=this;this._timerInterface=null,this._videoWidth=-1,this._videoHeight=-1,this._connectionType=null,
this._video=null,this._savedListeners={},this._ended=!1,this._onPlayingTriggered=!1,this._PHTChanged=!1,this._bitrate=null,b.VideoListeners={ON_BITRATE_CHANGE:"onBitrateChange",ON_ERROR:"onError",
ON_ENDED:"onEnded",ON_PLAYING:"onPlaying"},b.ErrorCodes={80000001:"ERROR",80000002:"ERROR_INVALID_CONFIG",80000003:"ERROR_INVALID_PARAMS",80000004:"ERROR_INIT_FAILED",80000005:"ERROR_OUT_OF_MEMORY",
80000100:"ERROR_NO_CONNECTION",80000104:"ERROR_ALREADY_IN_USE",80000105:"ERROR_VIDEO_DECODER_FAILED",80000106:"ERROR_AUDIO_DECODER_FAILED",80000107:"ERROR_MISSING_SEGMENTS",
80000109:"ERROR_VARIANT_PLAYLIST_TOO_LARGE",80000110:"ERROR_BUFFER_SIZE_TOO_SMALL"},this.cleanup=function(){this._log("TrilithiumProxy.cleanup()"),this._stopPolling(),this._removeAllEventListeners(),
this._video=null},this._overrideEventListener=function(a,b,c){g._savedListeners[b]=a[b];var d=function(){c.apply(g,arguments),
"function"==typeof g._savedListeners[b]&&g._savedListeners[b].apply(a,arguments)};a[b]=d},this._restoreEventListener=function(a,b){a[b]=g._savedListeners[b],g._savedListeners[b]=null},
this._setAllEventListeners=function(){if(g._log("TrilithiumProxy._setAllEventListeners()"),g._video){if(g._overrideEventListener(g._video,b.VideoListeners.ON_ERROR,g.onError),
g._overrideEventListener(g._video,b.VideoListeners.ON_BITRATE_CHANGE,g.onBitrateChange),g._overrideEventListener(g._video,b.VideoListeners.ON_ENDED,g.onEnded),
g._overrideEventListener(g._video,b.VideoListeners.ON_PLAYING,g.onPlaying),void 0!==engine.onSuspend&&"function"==typeof engine.onSuspend)var a=engine.onSuspend;if(engine.onSuspend=function(){
e.Analytics.reportAppBackgrounded(),void 0!==a&&"function"==typeof a&&a()},void 0!==engine.onResume&&"function"==typeof engine.onResume)var c=engine.onResume;engine.onResume=function(){
e.Analytics.reportAppForegrounded(),void 0!==c&&"function"==typeof c&&c()}}},this._removeAllEventListeners=function(){g._log("TrilithiumProxy._removeAllEventListeners()"),
g._video&&(g._restoreEventListener(g._video,b.VideoListeners.ON_ERROR),g._restoreEventListener(g._video,b.VideoListeners.ON_BITRATE_CHANGE),g._restoreEventListener(g._video,b.VideoListeners.ON_ENDED),
g._restoreEventListener(g._video,b.VideoListeners.ON_PLAYING)),g._savedListeners={}},this.onBitrateChange=function(){if(g._video){var a=g._video.currentBitrate;a>0&&a!==g._bitrate&&(g._bitrate=a,
g._videoAnalytics.reportPlaybackMetric(e.Constants.Playback.BITRATE,a,"CONVIVA"))}},this.onError=function(a){g._log("TrilithiumProxy.onError()")
;var c="ErrorCode:["+a+"]ErrorMessage:["+(b.ErrorCodes[a]||"ERROR_UNKNOWN")+"]";g._videoAnalytics.reportPlaybackError(c,e.Client.ErrorSeverity.FATAL)},this.onEnded=function(){
g._log("PlayStationTrilithiumStreamerProxy.onEnded"),g._setPlayerState(e.Constants.PlayerState.STOPPED),g._ended=!0,g._video&&(g._lastPHT=g._video.currentTime)},this.onPlaying=function(){
g._onPlayingTriggered=!0},this._setDuration=function(a){if(g._video&&isFinite(a)&&a>0&&g._duration!=a){g._log("TrilithiumProxy._setDuration() "+a),g._duration=a;var b={}
;b[e.Constants.DURATION]=g._duration,g._videoAnalytics.setContentInfo(b)}},this._startPolling=function(){g._polling=!0,
this._pollingTimerCancel=this._timerInterface.createTimer(this._poll,200,"TrilithiumProxy._poll()"),g.onBitrateChange()},this._poll=function(){
if(g._videoAnalytics.getAdType()!==e.Constants.AdType.CLIENT_SIDE){if(!g._polling&&!g._video)return;g._setDuration(g._video.duration),g.onBitrateChange(),
g._videoAnalytics.reportPlaybackMetric(e.Constants.Playback.PLAY_HEAD_TIME,1e3*g._video.currentTime,"CONVIVA");var a=g._video.currentTime;g._updateConnectionType(),
g._videoHeight==g._video.naturalHeight&&g._videoWidth==g._video.naturalWidth||(g._videoWidth=g._video.naturalWidth,g._videoHeight=g._video.naturalHeight,
g._videoAnalytics.reportPlaybackMetric(e.Constants.Playback.RESOLUTION,g._videoWidth,g._videoHeight,"CONVIVA")),
g._video.paused?g._playerState!==e.Constants.PlayerState.PAUSED&&(g._onPlayingTriggered=!1,
g._setPlayerState(e.Constants.PlayerState.PAUSED)):g._PHTChanged&&a>g._lastPHT&&Math.abs(a-g._lastPHT)<=.5?g._playerState!=e.Constants.PlayerState.PLAYING&&(g._onPlayingTriggered=!1,
g._setPlayerState(e.Constants.PlayerState.PLAYING),
g._ended=!1):g._PHTChanged&&a==g._lastPHT&&g._playerState!==e.Constants.PlayerState.STOPPED&&!g._ended&&(g._playerState!==e.Constants.PlayerState.PAUSED||g._onPlayingTriggered)&&(g._onPlayingTriggered=!1,
g._setPlayerState(e.Constants.PlayerState.BUFFERING)),a!=g._lastPHT&&(g._PHTChanged=!0,g._lastPHT=a)
}else g._playerState!=e.Constants.PlayerState.UNKNOWN&&(g._playerState=e.Constants.PlayerState.UNKNOWN)},this._stopPolling=function(){null!=this._pollingTimerCancel&&this._pollingTimerCancel(),
g._polling=!1},this._log=function(a){this._loggingInterface.log(a,e.SystemSettings.LogLevel.DEBUG)},this._setPlayerState=function(a){
g._playerState!==a&&(g._log("TrilithiumProxy._setPlayerState(): "+a),g._videoAnalytics.reportPlaybackMetric(e.Constants.Playback.PLAYER_STATE,a,"CONVIVA"),g._playerState=a)},
this._updateConnectionType=function(){var a=engine.stats.network.type;a=a.toString(),g._connectionType!==a&&(g._connectionType=a,e.Analytics.reportDeviceMetric(e.Constants.Network.CONNECTION_TYPE,a))
},f.apply(this,arguments)};b.version="4.0.2"}()}(),a});