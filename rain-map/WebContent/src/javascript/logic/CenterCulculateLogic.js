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
	/**
	 * 重心を計算するロジック
	 */
	var CenterCulculateLogic = {

		__name: 'geo.CenterCulculateLogic',
		VectorLogic: geo.VectorLogic,

		//メッシュの重心を計算
		culculateCenter: function(vertices, faces) {

			var center = new THREE.Vector3(0, 0, 0);
			var areaSum = 0;
			for (var i = 0; i < faces.length; i++) {

				//頂点の座標
				var vertice1 = vertices[faces[i].a];
				var vertice2 = vertices[faces[i].b];
				var vertice3 = vertices[faces[i].c];

				//着目している3角形の重心の計算
				var triangleCenter = this._culculateTriangleCenter(vertice1, vertice2, vertice3);
				//着目している3角形の面積
				var triangleArea = this.VectorLogic.culculateTriangleArea(vertice1, vertice2,
						vertice3);
				areaSum += triangleArea;

				//面積を重みとした各三角形の重心の線形和を計算
				center.x += triangleArea * triangleCenter.x;
				center.y += triangleArea * triangleCenter.y;
				center.z += triangleArea * triangleCenter.z;
			}

			center.x /= areaSum;
			center.y /= areaSum;
			center.z /= areaSum;

			return center;
		},

		//3角形の重心の座標を計算
		_culculateTriangleCenter: function(vector1, vector2, vector3) {

			var centerX = (vector1.x + vector2.x + vector3.x) / 3;
			var centerY = (vector1.y + vector2.y + vector3.y) / 3;
			var centerZ = (vector1.z + vector2.z + vector3.z) / 3;

			return new THREE.Vector3(centerX, centerY, centerZ);
		}
	};

	h5.core.expose(CenterCulculateLogic);
})(jQuery);