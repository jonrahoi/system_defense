import k from '/kaboom'

import Menu from '../scenes/menu'
import Buttons from '../scenes/buttons'

k.scene('menu', Menu)
k.scene('buttons', Buttons)

k.scene('main', () => {
    k.go('menu')
}
