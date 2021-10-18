/*
 * Convience object to get paths to each asset. 
 *
 * May prove to be unnecesary in which case direct paths can be referenced
 * by each file. However, Kaboom needs to have all sprites loaded at the top-most
 * level which means that only one file will be importing these assets (I think).
 * In that case it becomes much easier to manage paths by only ever needing to 
 * modify this file.
 *
 * Currently being used in '/src/interface/index.js'
 */



export const assetDirectory = {

    // All relative to public/
    'icons': {
        // Banner
        'usf': 'src/assets/icons/usf.png',
        'usfCS': 'src/assets/icons/usf_cs.png',
        'home': 'src/assets/icons/home.png',
        'mute': 'src/assets/icons/mute.png',
        'settings': 'src/assets/icons/settings.png',

        // Status Bar
        'level': 'src/assets/icons/level.png',
        'score': 'src/assets/icons/score.png',
        'coins': 'src/assets/icons/coins.png',
        'requests': 'src/assets/icons/requests.png',
        'timer': 'src/assets/icons/timer.png',

        // Time Control
        'play': 'src/assets/icons/play.png',
        'pause': 'src/assets/icons/pause.png',
        'restart': 'src/assets/icons/restart.png',
        'fastForward': 'src/assets/icons/fast_forward.png'
    },
    'images': {
        'components': {
            'cache': 'src/assets/images/components/cache.png',
            'database': 'src/assets/images/components/database.png',
            'desktop':  'src/assets/images/components/desktop.png',
            'gateway': 'src/assets/images/components/gateway.png',
            'hub': 'src/assets/images/components/hub.png',
            'iphone': 'src/assets/images/components/iphone.png',
            'load_balancer': 'src/assets/images/components/load_balancer.png',
            'modem': 'src/assets/images/components/modem.png',
            'router': 'src/assets/images/components/router.png',
            'server': 'src/assets/images/components/server.png'
        },
        'ui': {
            'captain_circled': 'src/assets/images/ui/captain_circled.png',
            'transparent_captain': 'src/assets/images/ui/captain_full_transparent.png',
            'captain_transparent_background': 'src/assets/images/ui/captain_transparent_background.png',
            'home_background': 'src/assets/images/ui/home_background.png',
            'network_background': 'src/assets/images/ui/network_background.png'
        }
    }
};

export default assetDirectory;

/**  
 * Need to attribute logos:
 * 
 * <div>
 *  Icons made by <a href="https://www.flaticon.com/authors/roundicons" 
 *    title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" 
 *      title="Flaticon">www.flaticon.com</a><
 * /div>
 **/