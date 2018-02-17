# physvr
## Quinn Ciccoretti, TJHSST
Framework for doing physics with WebVR and physijs

### Requires:
- VR Headset with controllers (tested with HTC Vive)
- WebVR compatible browser (tested with Firefox Nightly). See [WebVR's site](https://webvr.info/) for more info

### To run:
(Try the live demo of master at https://physvr.herokuapp.com)
1. Start a node server locally
   1. Ensure that node is installed properly with `node -v`
   2. Ensure that npm is installed properly with `npm -v`
   3. Run `npm install`
   4. Run `node serve.js`
   5. Use a browser to navigate to http://localhost:5000
2. If you don't have node, you can use python
- `python -m http.server` python3
- `python -m SimpleHTTPServer` python2