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

	var SIDELENGTH = 2;
	var DEFAULTBARMATERIAL1 = new THREE.MeshPhongMaterial({color: 0x19F4FE, overdraw: true});
	var DEFAULTBARMATERIAL2 = new THREE.MeshPhongMaterial({color: 0xFFA804, overdraw: true});
	var DEFAULTBARMATERIAL3 = new THREE.MeshPhongMaterial({color: 0xE7001E, overdraw: true});
	var THRESHOULD1 = 40;
	var THRESHOULD2 = 80;

	/**
	 * 与えられたmeshの重心にバーを表示するためのメッシュを生成するロジック
	 * valueがデータの値, mapMeshは地図をあらわすメッシュ, materialは棒グラフに張るmaterial, sidelengthは棒グラフの太さ
	 */
	var BarMeshCreateLogic = {

			__name: 'geo.BarMeshCreateLogic',

			CenterCulculateLogic: geo.CenterCulculateLogic,
			//VectorLogic: geo.VectorLogic,

			createBarMesh: function(value, mapMesh) {

				var geometry = new THREE.BoxGeometry(SIDELENGTH, SIDELENGTH, value);
				var material = DEFAULTBARMATERIAL1;
				var mesh = new THREE.Mesh(geometry, material);

				//メッシュの重心を計算
				var centerOfGravity = this.CenterCulculateLogic.culculateCenter(mapMesh.geometry.vertices, mapMesh.geometry.faces);
				mesh.position.set(centerOfGravity.x, -centerOfGravity.y, centerOfGravity.z + value / 2);

				//角度の計算
				mesh.rotation.set(mapMesh.rotation.x, mapMesh.rotation.y, mapMesh.rotation.z);

				return mesh;
			},

			updateBarMesh: function(newValue, barMesh) {
				var geometry = new THREE.BoxGeometry(SIDELENGTH, SIDELENGTH, newValue);
				barMesh.geometry = geometry;
				barMesh.position.z = newValue / 2 - 1;

				var material = this._selectMeshColor(newValue, THRESHOULD1, THRESHOULD2);
				barMesh.material = material;
				return barMesh;
			},

			_selectMeshColor: function(value, threshould1, threshould2) {

				var th1 = threshould1;
				var th2 = threshould2;
				if (threshould1 > threshould2) {
					th1 = threhould2;
					th2 = threshould1;
				}

				var material = DEFAULTBARMATERIAL1;
				if (th1 < value && value < th2) {
					material = DEFAULTBARMATERIAL2;
				} else if (th2 <= value ) {
					material = DEFAULTBARMATERIAL3;
				}

				return material;
			}
	};

	h5.core.expose(BarMeshCreateLogic);

})(jQuery);