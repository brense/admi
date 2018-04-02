export default function(src: string, id: string, onLoad?: () => void) {
  var js, fjs = document.getElementsByTagName('script')[0];
  if (document.getElementById(id)) { return; }
  js = document.createElement('script') as HTMLScriptElement; js.id = id;
  js.src = src;
  if (onLoad) {
    js.async = true;
    js.onload = () => onLoad();
  }
  if (fjs.parentNode) {
    fjs.parentNode.insertBefore(js, fjs);
  }
}
