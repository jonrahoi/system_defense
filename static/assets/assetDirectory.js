/*
 * Convience object to get paths to each asset. 
 *
 * May prove to be unnecesary in which case direct paths can be referenced
 * by each file. However, Kaboom needs to have all sprites loaded at the top-most
 * level which means that only one file will be importing these assets (I think).
 * In that case it becomes much easier to manage paths by only ever needing to 
 * modify this file.
 *
 * Currently being used in '/interface/index.js'
 */



export const assetDirectory = {

    // All relative to public/
    'icons': {
        // Banner
        'usf': 'assets/icons/usf.png',
        'usfCS': 'assets/icons/usf_cs.png',
        'home': 'assets/icons/home.png',
        'mute': 'assets/icons/mute.png',
        'settings': 'assets/icons/settings.png',

        // Status Bar
        'level': 'assets/icons/level.png',
        'score': 'assets/icons/score.png',
        'coins': 'assets/icons/coins.png',
        'requests': 'assets/icons/requests.png',
        'timer': 'assets/icons/timer.png',

        // Time Control
        'play': 'assets/icons/play.png',
        'pause': 'assets/icons/pause.png',
        'restart': 'assets/icons/restart.png',
        'fastForward': 'assets/icons/fast_forward.png'
    },
    'images': {
        'components': {
            'cache': 'assets/images/components/cache.png',
            'database': 'assets/images/components/database.png',
            'desktop':  'assets/images/components/desktop.png',
            'gateway': 'assets/images/components/gateway.png',
            'hub': 'assets/images/components/hub.png',
            'iphone': 'assets/images/components/iphone.png',
            'load_balancer': 'assets/images/components/load_balancer.png',
            'modem': 'assets/images/components/modem.png',
            'router': 'assets/images/components/router.png',
            'server': 'assets/images/components/server.png'
        },
        'ui': {
            'captain_circled': 'assets/images/ui/captain_circled.png',
            'transparent_captain': 'assets/images/ui/captain_full_transparent.png',
            'captain_transparent_background': 'assets/images/ui/captain_transparent_background.png',
            'home_background': 'assets/images/ui/home_background.png',
            'network_background': 'assets/images/ui/network_background.png'
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