(function(){
  if(window.GLOBAL_ENV.MODE !== 'production') return

  const style = {
    'font-size': '36px',
    'color': '#b26cf3',
    'font-weight': 'bold'
  }
  const redStyle = {
    'font-size': '24px',
    'color': 'red',
    'font-weight': 'bold'
  }
  const rawStyle = (style) => Object.keys(style).map(key => `${key}:${style[key]}`).join(';')

  const logger = () => {
    console.log('%cAttention!', rawStyle(style))
    console.log('%cYou can give attackers access to your Wizzl account by pasting anything here.', rawStyle(redStyle))
    setTimeout(logger, 10000)
  }

  logger()
}())