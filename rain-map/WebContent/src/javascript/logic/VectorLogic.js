/*
 * Copyright (C) 2014 NS Solutions Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function($) {

	var VectorLogic = {

		__name: 'geo.VectorLogic',

		fundamentalVector: {
			x: new THREE.Vector3(1, 0, 0),
			y: new THREE.Vector3(0, 1, 0),
			z: new THREE.Vector3(0, 0, 1)
		},

		//x, y, z方向の角度を計算
		culcVectorAngle: function(vector) {
			var rotationX = vector.angleTo(this.fundamentalVector.x);
			var rotationY = vector.angleTo(this.fundamentalVector.y);
			var rotationZ = vector.angleTo(this.fundamentalVector.z);
			return {
				x: rotationX,
				y: rotationY,
				z: rotationZ
			};
		},

		//二つのベクトルの内積を計算
		culcInnerProduct: function(vector1, vector2) {
			var innerProduct = vector1.x * vector2.x + vector1.y * vector2.y + vector1.z
					* vector2.z;
			return innerProduct;
		},

		//3つの位置ベクトルであらわされる三角形の面積を計算
		culculateTriangleArea: function(vector1, vector2, vector3) {

			//2辺をあらわすベクトル
			var sideVector1 = new THREE.Vector3(vector2.x - vector1.x, vector2.y - vector1.y,
					vector2.z - vector1.z);
			var sideVector2 = new THREE.Vector3(vector3.x - vector1.x, vector3.y - vector1.y,
					vector3.z - vector1.z);

			//2ベクトルの内積
			var innerProduct = this.culcInnerProduct(sideVector1, sideVector2);

			//ベクトルの長さの2乗
			var squaredLength1 = sideVector1.lengthSq();
			var squaredLength2 = sideVector2.lengthSq();

			//面積
			var area = 1 / 2 * Math.sqrt(squaredLength1 * squaredLength2 - innerProduct
					* innerProduct);
			return area;
		}

	};

	h5.core.expose(VectorLogic);

})(jQuery);