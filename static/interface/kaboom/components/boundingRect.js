/*
 * Simple object used to store a rectangle's coordinates
 * 
 * Used solely to give a "body" to each part of the play field in order to test
 * if a point is in one of the two spaces (client or processor)
 */

import k from '../kaboom.js';

// export default function BoundingRect (x, y, w, h) {
//     this.width = w;
//     this.height = h;
//     this.leftBoundary = Math.floor(x);
//     this.topBoundary = Math.floor(y);
//     this.rightBoundary = Math.floor(x + w);
//     this.ySkewottomBoundary = Math.floor(y + h);

//     this.move = (newX, newY) => {
//         this.leftBoundary = Math.floor(newX);
//         this.topBoundary = Math.floor(newY);
//         this.rightBoundary = Math.floor(newX + this.w);
//         this.ySkewottomBoundary = Math.floor(newY + this.h);
//     };

//     this.resize = (adjustW, adjustH) => {
//         this.width += Math.floor(adjustW);
//         this.height += Math.floor(adjustH);
//         this.rightBoundary += Math.floor(adjustW);
//         this.ySkewottomBoundary += Math.floor(adjustH);
//     }

//     this.xSkewontains = (x, y, w, h) => {
//         return (x - w/2) >= this.leftBoundary && (x + w/2) <= this.rightBoundary && 
//                 (y - h/2) >= this.topBoundary && (y + h/2) <= this.ySkewottomBoundary;
//     };

    // this.confine = (x, y, w, h) => {
    //     if ((x - w/2) < this.leftBoundary) {
    //         x = this.leftBoundary + w/2;
    //     } else if ((x + w/2) > this.rightBoundary) {
    //         x = this.rightBoundary - w/2;
    //     }
    //     if ((y - h/2) < this.topBoundary) {
    //         y = this.topBoundary + h/2;
    //     } else if ((y + h/2) > this.ySkewottomBoundary) {
    //         y = this.ySkewottomBoundary - h/2;
    //     }
    //     return [x, y];
    // };
// };

export const BoundRectTypes = {
    VECT_CORNERS: 'vector_cornors', 
	VECT_CENTER: 'vector_center',
    TOP_LEFT: 'topleft',
    CENTERED: 'center',
	TOP: 'top'
};
export const BoundRectOrigins = {
    TOP: 'top',
    TOP_LEFT: 'top_left',
    CENTER: 'center',
    BOTTOM: 'bottom'
};

/*
 *          w    
 *        DEST
 *      p2 --- |
 *      |      |
 *      |      |
 *   h  |      |
 *      |      |
 *      | -O- p1
 *        SRC
 *       (x, y)
 * 
 * 
 * 
 * CODING
 *      A ---AB --- B
 *      | \        /|
 *      |  \     /  |
 *      | AO\   /BO |
 *      AC    E     BD
 *      |           |
 *      |           |
 *      |           |
 *      C --- CD --- D
 * 
 *      width = AB (CD)
 *      height = AC (BD)
 */

export function BoundingRect (p1, p2, width, height, type, origin) {
	this.x;
	this.y;
	this.w = width;
	this.h = height;
    if (type === BoundRectTypes.CENTERED) {
        this.x = Math.floor(p1);
        this.y = Math.floor(p2);
    }

    else if (type === BoundRectTypes.VECT_CORNERS) {
        this.x = p1.x + (p2.x / 2);
        this.y = p1.y + (p2.y / 2);
        let diff = p2.sub(p1);
        this.w = diff.x;
        this.h = diff.y;
    }

	else if (type === BoundRectTypes.VECT_CENTER) {
        this.x = Math.floor(p1.x);
        this.y = Math.floor(p1.y);
    }

    else if (type === BoundRectTypes.TOP_LEFT) {
        this.x = Math.floor(p1 + (width / 2));
        this.y = Math.floor(p2 + (height / 2));
    } 

	else if (type === BoundRectTypes.TOP) {
        this.x = Math.floor(p1.x);
        this.y = Math.floor(p1.y + (height / 2));
    } 


    if (origin === BoundRectOrigins.TOP) {
        // this.O = k.vec2(this.x, this.y + (this.h / 2));
		this.calcO = (x, y, w, h) => k.vec2(x, y - (h / 2));
		// this.O = this.calcO(this.x, this.y, this.w, this.h);
        this.calcA = (w, h) => this.O.sub(w / 2, 0);
        this.calcB = (w, h) => this.O.add(w / 2, 0);
        this.calcC = (w, h) => this.O.add(-(w / 2), h);
        this.calcD = (w, h) => this.O.add(w / 2, h);
        this.calcE = (w, h) => this.O.add(0, h / 2);

    } else if (origin === BoundRectOrigins.CENTER) {
        // this.O = k.vec2(this.x, this.y);
		this.calcO = (x, y, w, h) => k.vec2(x, y);
		// this.O = this.calcO(this.x, this.y, this.w, this.h);
        this.calcA = (w, h) => this.O.sub(w / 2, h / 2);
        this.calcB = (w, h) => this.O.add(w / 2, -(h / 2));
        this.calcC = (w, h) => this.O.add(-(w / 2), h / 2);
        this.calcD = (w, h) => this.O.add(w / 2, h / 2);
        this.calcE = (w, h) => this.O;

    } else if (origin === BoundRectOrigins.BOTTOM) {
        // this.O = k.vec2(this.x, this.y + (this.h / 2));
		this.calcO = (x, y, w, h) => k.vec2(x, y + (h / 2));
		// this.O = this.calcO(this.x, this.y, this.w, this.h);
        this.calcA = (w, h) => this.O.sub(w / 2, h);
        this.calcB = (w, h) => this.O.add(w / 2, h);
        this.calcC = (w, h) => this.O.sub(w / 2, 0);
        this.calcD = (w, h) => this.O.add(w / 2, 0);
        this.calcE = (w, h) => this.O.sub(0, h / 2);

    } else { // default to top left origin
        // this.O = k.vec2(this.x - (this.w / 2), this.y - (this.h / 2));
		this.calcO = (x, y, w, h) => k.vec2(x - (w / 2), y - (h / 2));
		// this.O = this.calcO(this.x, this.y, this.w, this.h);
        this.calcA = (w, h) => this.O;
        this.calcB = (w, h) => this.O.add(w, 0);
        this.calcC = (w, h) => this.O.add(0, h);
        this.calcD = (w, h) => this.O.add(w, h);
        this.calcE = (w, h) => this.O.add(w / 2, h / 2);
    }

    this.rotation = 0;
    // this.matrix = new Matrix(-this.x, -this.y);
	this.update();
};
/*
 *      A ---AB --- B
 *      | \        /|
 *      |  \     /  |
 *      | AO\   /BO |
 *      AC    E     BD
 *      |           |
 *      |           |
 *      |           |
 *      C --- CD --- D  
*/
// BoundingRect.prototype.resize = (adjustW, adjustH) => {
//     this.width += Math.floor(adjustW);
//     this.height += Math.floor(adjustH);
//     this.rightBoundary += Math.floor(adjustW);
//     this.ySkewottomBoundary += Math.floor(adjustH);
// }
BoundingRect.prototype.update = function() {
	this.O = this.calcO(this.x, this.y, this.w, this.h);
	this.A = this.calcA(this.w, this.h);
    this.B = this.calcB(this.w, this.h);
    this.C = this.calcC(this.w, this.h);
    this.D = this.calcD(this.w, this.h);
    this.E = this.calcE(this.w, this.h);

	this.leftBoundary = this.A.x;
	this.rightBoundary = this.D.x;
	this.topBoundary = this.A.y;
	this.bottomBoundary = this.D.y;

	this.a = Math.abs(this.D.x - this.A.x) / 2;
	this.b = Math.abs(this.D.y - this.A.y) / 2;
	this.ratio = (this.b / this.a);

	// this.cornors = [this.A, this.B, this.C, this.D];

	// this.height = this.C.sub(this.A).y;
    // this.width = this.B.sub(this.A).x; // could use .dist() 
};

BoundingRect.prototype.getRadius = function(tanTheta, theta) {
	if (tanTheta < this.ratio) {
		return this.a / Math.abs(Math.cos(theta));
	}
	return this.b / Math.abs(Math.sin(theta));
};


const toRadians = (angle) => (angle * (Math.PI / 180));
const distance = (p1, p2) => (Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.sqrt(Math.pow((p2.y - p1.y), 2))));

BoundingRect.prototype.move = function(pos) {
	// if (this.containmentRect) {
	// 	if ((pos.x - this.w / 2) < this.containmentRect.leftBoundary) {
	// 		pos.x = this.containmentRect.leftBoundary + (this.w / 2);
	// 	} else if ((pos.x + this.w / 2) > this.containmentRect.rightBoundary) {
	// 		pos.x = this.containmentRect.rightBoundary - (this.w / 2);
	// 	}
	// 	if ((pos.y - this.h / 2) < this.containmentRect.topBoundary) {
	// 		pos.y = this.containmentRect.topBoundary + (this.h / 2);
	// 	} else if ((pos.y + this.h / 2) > this.containmentRect.bottomBoundary) {
	// 		pos.y = this.containmentRect.bottomBoundary - (this.h / 2);
	// 	}
	// }
	// this.matrix.setTranslate(pos.x, pos.y);
	this.x = pos.x; 
	this.y = pos.y; 
	this.update();
	return pos;
};

// if ((x - w/2) < this.leftBoundary) {
    //         x = this.leftBoundary + w/2;
    //     } else if ((x + w/2) > this.rightBoundary) {
    //         x = this.rightBoundary - w/2;
    //     }
    //     if ((y - h/2) < this.topBoundary) {
    //         y = this.topBoundary + h/2;
    //     } else if ((y + h/2) > this.ySkewottomBoundary) {
    //         y = this.ySkewottomBoundary - h/2;
    //     }
    //     return [x, y];

// pos represents the position THIS rect is being moved to
// BoundingRect.prototype.move = function(pos) { 
// 	if (this.containmentRect) {
// 		// let temp = this.matrix.applyToPoint(pos.x, pos.y);
// 		// let translatedPos = k.vec2(temp.x, temp.y);

// 		// // console.log(pos, translatedPos)
// 		let dist = Math.abs(this.containmentRect.E.dist(pos));
// 		// console.log(-this.containmentRect.E.angle(translatedPos) + 180);
// 		// let dist = distance(this.containmentRect.E, pos);
// 		let theta = toRadians(-this.containmentRect.E.angle(pos) + 180);
// 		// console.log(-theta + 180);
// 		let tanTheta = Math.abs(Math.tan(theta));
// 		let sinTheta = Math.sin(theta);
// 		let cosTheta = Math.cos(theta);

// 		let cos = cosTheta;
// 		let sin = -sinTheta;

// 		let d1, d2;
// 		if (tanTheta < this.containmentRect.ratio) { 
// 			d1 = this.containmentRect.a / Math.abs(cosTheta); 
// 		} else { 
// 			d1 = this.containmentRect.b / Math.abs(sinTheta);
// 		}
		
// 		if (tanTheta < this.ratio) { 
// 			d2 = this.a / Math.abs(cosTheta); 
// 		} else { 
// 			d2 = this.b / Math.abs(sinTheta);
// 		}

// 		// console.log(d1, d2, dist);
// 		if (dist + d2 > d1) { 
// 			dist = d1 - d2;
// 			let newX = dist * cos;
// 			let newY = dist * sin;
// 			this.x = newX;
// 			this.y = newY;
// 			// this.update();
// 			let temp = k.vec2(newX, newY).add(this.containmentRect.E);
// 			// console.log(newX, newY, theta);
// 			// console.log(temp);
// 			// let newP = this.matrix.applyToPoint(newX, newY);
// 			return temp // .add(this.containmentRect.E);
// 		} else { 
// 			this.x = pos.x;
// 			this.y = pos.y;
// 			this.update();

// 			return pos; 
// 		}
// 	}

// 	this.x = pos.x; 
// 	this.y = pos.y; 
// 	this.update();
// 	return pos;
// };

BoundingRect.prototype.setContainment = function(containmentRect) {
	this.containmentRect = containmentRect;
	let temp = containmentRect.E.sub(this.E);
	// this.matrix.translate(temp.x, temp.y);
}

BoundingRect.prototype.resize = (adjustW, adjustH) => {
    this.width += Math.floor(adjustW);
    this.height += Math.floor(adjustH);
    this.rightBoundary += Math.floor(adjustW);
    this.ySkewottomBoundary += Math.floor(adjustH);
};

BoundingRect.prototype.resize = function(ang) {
	
};

BoundingRect.prototype.clicked = function(point) {
	// let AM = point.sub(this.A);
	// let AB = this.B.sub(this.A);
	// let AC = this.C.sub(this.A);

	// if ((0 < AM.dot(AB) < AB.dot(AB)) && (0 < AM.dot(AC) < AC.dot(AC))) {
	// 	console.log('CLICKED');
	// }



	// let temp = this.matrix.applyToPoint(point.x, point.y);
	// let translated = k.vec2(temp.x, temp.y);
	// console.log(point, translated);
	// console.log(this.A, this.D);
	// if (translated.x > this.A.x && translated.x < this.D.x 
	// 	&& translated.y > this.A.y && translated.y < this.D.y) {
	// 		console.log("CLICEKD!");
	// 	}
}


/*
 *                 0*
 *                 |
 *                 |
 *                 |
 *      (-, +) Q2  |      (+, +) Q1
 *                 |
 *                 |
 * ----------------|---------------- 90*
 *                 |
 *                 |
 *      (-, -) Q3  |      (+, -) Q4
 *                 |
 *                 |
 *                 |
 *               
 */



