#!/usr/bin/env node
// lamba check: is your Lamba app ready to upload? One file, nothing to install (Node 18 or newer):
//   node lamba-check.mjs my-app
//   node lamba-check.mjs my-app --preview    (a link to play it, on a phone too: needs node lamba-login.mjs once)
//   node lamba-check.mjs --try my-app       (puts the newest version on your own screens)    node lamba-check.mjs --download my-app   (gets your app's folder back)
//   node lamba-check.mjs my-app --upload     (checks, then uploads it as a new version; connect first: node lamba-login.mjs, or LAMBA_KEY)
// It runs the very check Lamba's server runs on every app you upload (docs: https://lamba.tv/devs/docs/submit/)
// and says in plain words what to fix. Made by Lamba's tools/sdk_kit.mjs from the server's own code; get the newest at
// https://lamba.tv/devs/kit/lamba-check.mjs
/*! acorn 8.11.3 (https://github.com/acornjs/acorn), MIT License:
 * MIT License
 *
 * Copyright (C) 2012-2022 by various contributors (see AUTHORS)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve, relative, basename, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

// ---- node_modules/acorn/dist/acorn.mjs ----
const M_acorn = (() => {
// This file was generated. Do not modify manually!
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

// This file was generated. Do not modify manually!
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];

// This file was generated. Do not modify manually!
var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0cf3\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ece\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\u30fb\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f\uff65";

// This file was generated. Do not modify manually!
var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";

// These are a run-length and offset encoded representation of the
// >0xffff code points that are a valid part of identifiers. The
// offset starts at 0x10000, and each pair of numbers represents an
// offset to the next range, and then a size of the range.

// Reserved word lists for various dialects of the language

var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};

// And the keywords

var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};

var keywordRelationalOperator = /^in(stanceof)?$/;

// ## Character categories

var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

// This has a complexity linear to the value of the code. The
// assumption is that looking up astral identifier characters is
// rare.
function isInAstralSet(code, set) {
  var pos = 0x10000;
  for (var i = 0; i < set.length; i += 2) {
    pos += set[i];
    if (pos > code) { return false }
    pos += set[i + 1];
    if (pos >= code) { return true }
  }
  return false
}

// Test whether a given character code starts an identifier.

function isIdentifierStart(code, astral) {
  if (code < 65) { return code === 36 }
  if (code < 91) { return true }
  if (code < 97) { return code === 95 }
  if (code < 123) { return true }
  if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
  if (astral === false) { return false }
  return isInAstralSet(code, astralIdentifierStartCodes)
}

// Test whether a given character is part of an identifier.

function isIdentifierChar(code, astral) {
  if (code < 48) { return code === 36 }
  if (code < 58) { return true }
  if (code < 65) { return false }
  if (code < 91) { return true }
  if (code < 97) { return code === 95 }
  if (code < 123) { return true }
  if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
  if (astral === false) { return false }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
}

// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// The `startsExpr` property is used to check if the token ends a
// `yield` expression. It is set on all token types that either can
// directly start an expression (like a quotation mark) or can
// continue an expression (like the body of a string).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

var TokenType = function TokenType(label, conf) {
  if ( conf === void 0 ) conf = {};

  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};

function binop(name, prec) {
  return new TokenType(name, {beforeExpr: true, binop: prec})
}
var beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};

// Map keyword names to token types.

var keywords = {};

// Succinct definitions of keyword token types
function kw(name, options) {
  if ( options === void 0 ) options = {};

  options.keyword = name;
  return keywords[name] = new TokenType(name, options)
}

var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
  assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
  incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
  prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", {beforeExpr: true}),
  coalesce: binop("??", 1),

  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", {isLoop: true, beforeExpr: true}),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", {isLoop: true}),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", {isLoop: true}),
  _with: kw("with"),
  _new: kw("new", {beforeExpr: true, startsExpr: true}),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", {beforeExpr: true, binop: 7}),
  _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
  _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
  _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
  _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
};

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.

var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");

function isNewLine(code) {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
}

function nextLineBreak(code, from, end) {
  if ( end === void 0 ) end = code.length;

  for (var i = from; i < end; i++) {
    var next = code.charCodeAt(i);
    if (isNewLine(next))
      { return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1 }
  }
  return -1
}

var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;

var hasOwn = Object.hasOwn || (function (obj, propName) { return (
  hasOwnProperty.call(obj, propName)
); });

var isArray = Array.isArray || (function (obj) { return (
  toString.call(obj) === "[object Array]"
); });

var regexpCache = Object.create(null);

function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"))
}

function codePointToString(code) {
  // UTF-16 Decoding
  if (code <= 0xFFFF) { return String.fromCharCode(code) }
  code -= 0x10000;
  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
}

var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;

// These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.

var Position = function Position(line, col) {
  this.line = line;
  this.column = col;
};

Position.prototype.offset = function offset (n) {
  return new Position(this.line, this.column + n)
};

var SourceLocation = function SourceLocation(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) { this.source = p.sourceFile; }
};

// The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.

function getLineInfo(input, offset) {
  for (var line = 1, cur = 0;;) {
    var nextBreak = nextLineBreak(input, cur, offset);
    if (nextBreak < 0) { return new Position(line, offset - cur) }
    ++line;
    cur = nextBreak;
  }
}

// A second argument must be given to configure the parser process.
// These options are recognized (only `ecmaVersion` is required):

var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: false,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: true,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback\u2014that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback\u2014that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};

// Interpret and default an options object

var warnedAboutEcmaVersion = false;

function getOptions(opts) {
  var options = {};

  for (var opt in defaultOptions)
    { options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt]; }

  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }

  if (options.allowReserved == null)
    { options.allowReserved = options.ecmaVersion < 5; }

  if (!opts || opts.allowHashBang == null)
    { options.allowHashBang = options.ecmaVersion >= 14; }

  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function (token) { return tokens.push(token); };
  }
  if (isArray(options.onComment))
    { options.onComment = pushComment(options, options.onComment); }

  return options
}

function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start: start,
      end: end
    };
    if (options.locations)
      { comment.loc = new SourceLocation(this, startLoc, endLoc); }
    if (options.ranges)
      { comment.range = [start, end]; }
    array.push(comment);
  }
}

// Each scope gets a bitset that may contain these flags
var
    SCOPE_TOP = 1,
    SCOPE_FUNCTION = 2,
    SCOPE_ASYNC = 4,
    SCOPE_GENERATOR = 8,
    SCOPE_ARROW = 16,
    SCOPE_SIMPLE_CATCH = 32,
    SCOPE_SUPER = 64,
    SCOPE_DIRECT_SUPER = 128,
    SCOPE_CLASS_STATIC_BLOCK = 256,
    SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;

function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0)
}

// Used in checkLVal* and declareName to determine the type of a binding
var
    BIND_NONE = 0, // Not a binding
    BIND_VAR = 1, // Var-style binding
    BIND_LEXICAL = 2, // Let- or const-style binding
    BIND_FUNCTION = 3, // Function declaration
    BIND_SIMPLE_CATCH = 4, // Simple (identifier pattern) catch binding
    BIND_OUTSIDE = 5; // Special case for function names as bound inside the function

var Parser = function Parser(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") { reserved += " await"; }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);

  // Used to signal to callers of `readWord1` whether the word
  // contained any escape sequences. This is needed because words with
  // escape sequences must not be interpreted as keywords.
  this.containsEsc = false;

  // Set up token state

  // The current position of the tokenizer in the input.
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }

  // Properties of the current token:
  // Its type
  this.type = types$1.eof;
  // For tokens that include more information than their type, the value
  this.value = null;
  // Its start and end offset
  this.start = this.end = this.pos;
  // And, if locations are used, the {line, column} object
  // corresponding to those offsets
  this.startLoc = this.endLoc = this.curPosition();

  // Position information for the previous token
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;

  // The context stack is used to superficially track syntactic
  // context to predict whether a regular expression is allowed in a
  // given position.
  this.context = this.initialContext();
  this.exprAllowed = true;

  // Figure out if it's a module code.
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);

  // Used to signify the start of a potential arrow function
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;

  // Positions to delayed-check that yield/await does not exist in default parameters.
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  // Labels in scope.
  this.labels = [];
  // Thus-far undefined exports.
  this.undefinedExports = Object.create(null);

  // If enabled, skip leading hashbang line.
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
    { this.skipLineComment(2); }

  // Scope tracking for duplicate variable names (see scope.js)
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);

  // For RegExp validation
  this.regexpState = null;

  // The stack of private names.
  // Each element has two properties: 'declared' and 'used'.
  // When it exited from the outermost class definition, all used private names must be declared.
  this.privateNameStack = [];
};

var prototypeAccessors = { inFunction: { configurable: true },inGenerator: { configurable: true },inAsync: { configurable: true },canAwait: { configurable: true },allowSuper: { configurable: true },allowDirectSuper: { configurable: true },treatFunctionsAsVar: { configurable: true },allowNewDotTarget: { configurable: true },inClassStaticBlock: { configurable: true } };

Parser.prototype.parse = function parse () {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node)
};

prototypeAccessors.inFunction.get = function () { return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0 };

prototypeAccessors.inGenerator.get = function () { return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit };

prototypeAccessors.inAsync.get = function () { return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit };

prototypeAccessors.canAwait.get = function () {
  for (var i = this.scopeStack.length - 1; i >= 0; i--) {
    var scope = this.scopeStack[i];
    if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) { return false }
    if (scope.flags & SCOPE_FUNCTION) { return (scope.flags & SCOPE_ASYNC) > 0 }
  }
  return (this.inModule && this.options.ecmaVersion >= 13) || this.options.allowAwaitOutsideFunction
};

prototypeAccessors.allowSuper.get = function () {
  var ref = this.currentThisScope();
    var flags = ref.flags;
    var inClassFieldInit = ref.inClassFieldInit;
  return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod
};

prototypeAccessors.allowDirectSuper.get = function () { return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0 };

prototypeAccessors.treatFunctionsAsVar.get = function () { return this.treatFunctionsAsVarInScope(this.currentScope()) };

prototypeAccessors.allowNewDotTarget.get = function () {
  var ref = this.currentThisScope();
    var flags = ref.flags;
    var inClassFieldInit = ref.inClassFieldInit;
  return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit
};

prototypeAccessors.inClassStaticBlock.get = function () {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0
};

Parser.extend = function extend () {
    var plugins = [], len = arguments.length;
    while ( len-- ) plugins[ len ] = arguments[ len ];

  var cls = this;
  for (var i = 0; i < plugins.length; i++) { cls = plugins[i](cls); }
  return cls
};

Parser.parse = function parse (input, options) {
  return new this(options, input).parse()
};

Parser.parseExpressionAt = function parseExpressionAt (input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression()
};

Parser.tokenizer = function tokenizer (input, options) {
  return new this(options, input)
};

Object.defineProperties( Parser.prototype, prototypeAccessors );

var pp$9 = Parser.prototype;

// ## Parser utilities

var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) { return false }
  for (;;) {
    // Try to find string literal.
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) { return false }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" ||
        (lineBreak.test(spaceAfter[0]) &&
         !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "="))
    }
    start += match[0].length;

    // Skip semicolon, if any.
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";")
      { start++; }
  }
};

// Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.

pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true
  } else {
    return false
  }
};

// Tests whether parsed token is a contextual keyword.

pp$9.isContextual = function(name) {
  return this.type === types$1.name && this.value === name && !this.containsEsc
};

// Consumes contextual keyword if possible.

pp$9.eatContextual = function(name) {
  if (!this.isContextual(name)) { return false }
  this.next();
  return true
};

// Asserts that following token is given contextual keyword.

pp$9.expectContextual = function(name) {
  if (!this.eatContextual(name)) { this.unexpected(); }
};

// Test whether a semicolon can be inserted at the current position.

pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof ||
    this.type === types$1.braceR ||
    lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
};

pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon)
      { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
    return true
  }
};

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) { this.unexpected(); }
};

pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma)
      { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
    if (!notNext)
      { this.next(); }
    return true
  }
};

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};

// Raise an unexpected token error.

pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};

var DestructuringErrors = function DestructuringErrors() {
  this.shorthandAssign =
  this.trailingComma =
  this.parenthesizedAssign =
  this.parenthesizedBind =
  this.doubleProto =
    -1;
};

pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) { return }
  if (refDestructuringErrors.trailingComma > -1)
    { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) { this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern"); }
};

pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) { return false }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
  if (shorthandAssign >= 0)
    { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
  if (doubleProto >= 0)
    { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
};

pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
    { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
  if (this.awaitPos)
    { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
};

pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression")
    { return this.isSimpleAssignTarget(expr.expression) }
  return expr.type === "Identifier" || expr.type === "MemberExpression"
};

var pp$8 = Parser.prototype;

// ### Statement parsing

// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.

pp$8.parseTopLevel = function(node) {
  var exports = Object.create(null);
  if (!node.body) { node.body = []; }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule)
    { for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1)
      {
        var name = list[i];

        this.raiseRecoverable(this.undefinedExports[name].start, ("Export '" + name + "' is not defined"));
      } }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program")
};

var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
  // For ambiguous cases, determine if a LexicalDeclaration (or only a
  // Statement) is allowed here. If context is not empty then only a Statement
  // is allowed. However, `let [` is an explicit negative lookahead for
  // ExpressionStatement, so special-case it first.
  if (nextCh === 91 || nextCh === 92) { return true } // '[', '/'
  if (context) { return false }

  if (nextCh === 123 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true } // '{', astral
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) { ++pos; }
    if (nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) { return true }
  }
  return false
};

// check 'async [no LineTerminator here] function'
// - 'async /*foo*/ function' is OK.
// - 'async /*\n*/ function' is invalid.
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
    { return false }

  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next)) &&
    this.input.slice(next, next + 8) === "function" &&
    (next + 8 === this.input.length ||
     !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 0xd7ff && after < 0xdc00))
};

// Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo)`, where looking at the previous token
// does not help.

pp$8.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node = this.startNode(), kind;

  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }

  // Most types of statements are recognized by the keyword they
  // start with. Many are trivial to parse, some require a bit of
  // complexity.

  switch (starttype) {
  case types$1._break: case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
  case types$1._debugger: return this.parseDebuggerStatement(node)
  case types$1._do: return this.parseDoStatement(node)
  case types$1._for: return this.parseForStatement(node)
  case types$1._function:
    // Function as sole body of either an if statement or a labeled statement
    // works, but not when it is part of a labeled statement that is the sole
    // body of an if statement.
    if ((context && (this.strict || context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6) { this.unexpected(); }
    return this.parseFunctionStatement(node, false, !context)
  case types$1._class:
    if (context) { this.unexpected(); }
    return this.parseClass(node, true)
  case types$1._if: return this.parseIfStatement(node)
  case types$1._return: return this.parseReturnStatement(node)
  case types$1._switch: return this.parseSwitchStatement(node)
  case types$1._throw: return this.parseThrowStatement(node)
  case types$1._try: return this.parseTryStatement(node)
  case types$1._const: case types$1._var:
    kind = kind || this.value;
    if (context && kind !== "var") { this.unexpected(); }
    return this.parseVarStatement(node, kind)
  case types$1._while: return this.parseWhileStatement(node)
  case types$1._with: return this.parseWithStatement(node)
  case types$1.braceL: return this.parseBlock(true, node)
  case types$1.semi: return this.parseEmptyStatement(node)
  case types$1._export:
  case types$1._import:
    if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
      if (nextCh === 40 || nextCh === 46) // '(' or '.'
        { return this.parseExpressionStatement(node, this.parseExpression()) }
    }

    if (!this.options.allowImportExportEverywhere) {
      if (!topLevel)
        { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
      if (!this.inModule)
        { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
    }
    return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports)

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
  default:
    if (this.isAsyncFunction()) {
      if (context) { this.unexpected(); }
      this.next();
      return this.parseFunctionStatement(node, true, !context)
    }

    var maybeName = this.value, expr = this.parseExpression();
    if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon))
      { return this.parseLabeledStatement(node, maybeName, expr, context) }
    else { return this.parseExpressionStatement(node, expr) }
  }
};

pp$8.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) { node.label = null; }
  else if (this.type !== types$1.name) { this.unexpected(); }
  else {
    node.label = this.parseIdent();
    this.semicolon();
  }

  // Verify that there is an actual destination to break or
  // continue to.
  var i = 0;
  for (; i < this.labels.length; ++i) {
    var lab = this.labels[i];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
      if (node.label && isBreak) { break }
    }
  }
  if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
};

pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement")
};

pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6)
    { this.eat(types$1.semi); }
  else
    { this.semicolon(); }
  return this.finishNode(node, "DoWhileStatement")
};

// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.

pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = (this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await")) ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, null)
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      return this.parseForIn(node, init$1)
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init$1)
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var refDestructuringErrors = new DestructuringErrors;
  var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types$1._in) {
        if (awaitAt > -1) { this.unexpected(awaitAt); }
      } else { node.await = awaitAt > -1; }
    }
    if (startsWithLet && isForOf) { this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'."); }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init)
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) { this.unexpected(awaitAt); }
  return this.parseFor(node, init)
};

pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
};

pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  // allow function declarations in branches, but only in non-strict mode
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement")
};

pp$8.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction)
    { this.raise(this.start, "'return' outside of function"); }
  this.next();

  // In `return` (and `break`/`continue`), the keywords with
  // optional arguments, we eagerly look for a semicolon or the
  // possibility to insert one.

  if (this.eat(types$1.semi) || this.insertSemicolon()) { node.argument = null; }
  else { node.argument = this.parseExpression(); this.semicolon(); }
  return this.finishNode(node, "ReturnStatement")
};

pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);

  // Statements under must be grouped (by label) in SwitchCase
  // nodes. `cur` is used to keep the node that we are currently
  // adding statements to.

  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR;) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) { this.finishNode(cur, "SwitchCase"); }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) { this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"); }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) { this.unexpected(); }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) { this.finishNode(cur, "SwitchCase"); }
  this.next(); // Closing brace
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement")
};

pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
    { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement")
};

// Reused empty array added for node fields that are always empty.

var empty$1 = [];

pp$8.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom();
  var simple = param.type === "Identifier";
  this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);

  return param
};

pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseCatchClauseParam();
    } else {
      if (this.options.ecmaVersion < 10) { this.unexpected(); }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer)
    { this.raise(node.start, "Missing catch or finally clause"); }
  return this.finishNode(node, "TryStatement")
};

pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration")
};

pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement")
};

pp$8.parseWithStatement = function(node) {
  if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement")
};

pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement")
};

pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1)
    {
    var label = list[i$1];

    if (label.name === maybeName)
      { this.raise(expr.start, "Label '" + maybeName + "' is already declared");
  } }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i = this.labels.length - 1; i >= 0; i--) {
    var label$1 = this.labels[i];
    if (label$1.statementStart === node.start) {
      // Update information about previous labels on this node
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else { break }
  }
  this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement")
};

pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement")
};

// Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).

pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
  if ( node === void 0 ) node = this.startNode();

  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) { this.enterScope(0); }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) { this.strict = false; }
  this.next();
  if (createNewLexicalScope) { this.exitScope(); }
  return this.finishNode(node, "BlockStatement")
};

// Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.

pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement")
};

// Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.

pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();

  if (
    init.type === "VariableDeclaration" &&
    init.declarations[0].init != null &&
    (
      !isForIn ||
      this.options.ecmaVersion < 8 ||
      this.strict ||
      init.kind !== "var" ||
      init.declarations[0].id.type !== "Identifier"
    )
  ) {
    this.raise(
      init.start,
      ((isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer")
    );
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement")
};

// Parse a list of variable declarations.

pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (;;) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))) {
      this.unexpected();
    } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) { break }
  }
  return node
};

pp$8.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};

var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;

// Parse a function declaration or literal (depending on the
// `statement & FUNC_STATEMENT`).

// Remove `allowExpressionBody` for 7.0.0, as it is only called with false
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && (statement & FUNC_HANGING_STATEMENT))
      { this.unexpected(); }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8)
    { node.async = !!isAsync; }

  if (statement & FUNC_STATEMENT) {
    node.id = (statement & FUNC_NULLABLE_ID) && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT))
      // If it is a regular function declaration in sloppy mode, then it is
      // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
      // mode depends on properties of the current scope (see
      // treatFunctionsAsVar).
      { this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION); }
  }

  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));

  if (!(statement & FUNC_STATEMENT))
    { node.id = this.type === types$1.name ? this.parseIdent() : null; }

  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, (statement & FUNC_STATEMENT) ? "FunctionDeclaration" : "FunctionExpression")
};

pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};

// Parse a class declaration or literal (depending on the
// `isStatement` parameter).

pp$8.parseClass = function(node, isStatement) {
  this.next();

  // ecma-262 14.6 Class Definitions
  // A class definition is always strict mode code.
  var oldStrict = this.strict;
  this.strict = true;

  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) { this.raiseRecoverable(element.start, "Duplicate constructor in the same class"); }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, ("Identifier '#" + (element.key.name) + "' has already been declared"));
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
};

pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) { return null }

  var ecmaVersion = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;

  if (this.eatContextual("static")) {
    // Parse static init block
    if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }

  // Parse element name
  if (keyName) {
    // 'async', 'get', 'set', or 'static' were not a keyword contextually.
    // The last token is any of those. Make it the element name.
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }

  // Parse element value
  if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    // Couldn't move this check into the 'parseClassMethod' method for backward compatibility.
    if (isConstructor && kind !== "method") { this.raise(node.key.start, "Constructor can't have get/set modifier"); }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }

  return node
};

pp$8.isClassElementNameStart = function() {
  return (
    this.type === types$1.name ||
    this.type === types$1.privateId ||
    this.type === types$1.num ||
    this.type === types$1.string ||
    this.type === types$1.bracketL ||
    this.type.keyword
  )
};

pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};

pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  // Check key and flags
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
    if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }

  // Parse value
  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);

  // Check value
  if (method.kind === "get" && value.params.length !== 0)
    { this.raiseRecoverable(value.start, "getter should have no params"); }
  if (method.kind === "set" && value.params.length !== 1)
    { this.raiseRecoverable(value.start, "setter should have exactly one param"); }
  if (method.kind === "set" && value.params[0].type === "RestElement")
    { this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params"); }

  return this.finishNode(method, "MethodDefinition")
};

pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }

  if (this.eat(types$1.eq)) {
    // To raise SyntaxError if 'arguments' exists in the initializer.
    var scope = this.currentThisScope();
    var inClassFieldInit = scope.inClassFieldInit;
    scope.inClassFieldInit = true;
    field.value = this.parseMaybeAssign();
    scope.inClassFieldInit = inClassFieldInit;
  } else {
    field.value = null;
  }
  this.semicolon();

  return this.finishNode(field, "PropertyDefinition")
};

pp$8.parseClassStaticBlock = function(node) {
  node.body = [];

  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;

  return this.finishNode(node, "StaticBlock")
};

pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement)
      { this.checkLValSimple(node.id, BIND_LEXICAL, false); }
  } else {
    if (isStatement === true)
      { this.unexpected(); }
    node.id = null;
  }
};

pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};

pp$8.enterClassBody = function() {
  var element = {declared: Object.create(null), used: []};
  this.privateNameStack.push(element);
  return element.declared
};

pp$8.exitClassBody = function() {
  var ref = this.privateNameStack.pop();
  var declared = ref.declared;
  var used = ref.used;
  if (!this.options.checkPrivateFields) { return }
  var len = this.privateNameStack.length;
  var parent = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i = 0; i < used.length; ++i) {
    var id = used[i];
    if (!hasOwn(declared, id.name)) {
      if (parent) {
        parent.used.push(id);
      } else {
        this.raiseRecoverable(id.start, ("Private field '#" + (id.name) + "' must be declared in an enclosing class"));
      }
    }
  }
};

function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];

  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }

  // `class { get #a(){}; static set #a(_){} }` is also conflict.
  if (
    curr === "iget" && next === "iset" ||
    curr === "iset" && next === "iget" ||
    curr === "sget" && next === "sset" ||
    curr === "sset" && next === "sget"
  ) {
    privateNameMap[name] = "true";
    return false
  } else if (!curr) {
    privateNameMap[name] = next;
    return false
  } else {
    return true
  }
}

function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (
    key.type === "Identifier" && key.name === name ||
    key.type === "Literal" && key.value === name
  )
}

// Parses module export declaration.

pp$8.parseExportAllDeclaration = function(node, exports) {
  if (this.options.ecmaVersion >= 11) {
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports, node.exported, this.lastTokStart);
    } else {
      node.exported = null;
    }
  }
  this.expectContextual("from");
  if (this.type !== types$1.string) { this.unexpected(); }
  node.source = this.parseExprAtom();
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration")
};

pp$8.parseExport = function(node, exports) {
  this.next();
  // export * from '...'
  if (this.eat(types$1.star)) {
    return this.parseExportAllDeclaration(node, exports)
  }
  if (this.eat(types$1._default)) { // export default ...
    this.checkExport(exports, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration")
  }
  // export var|const|let|function|class ...
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    if (node.declaration.type === "VariableDeclaration")
      { this.checkVariableExport(exports, node.declaration.declarations); }
    else
      { this.checkExport(exports, node.declaration.id, node.declaration.id.start); }
    node.specifiers = [];
    node.source = null;
  } else { // export { x, y as z } [from '...']
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) { this.unexpected(); }
      node.source = this.parseExprAtom();
    } else {
      for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
        // check for keywords used as local names
        var spec = list[i];

        this.checkUnreserved(spec.local);
        // check if export is defined
        this.checkLocalExport(spec.local);

        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }

      node.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration")
};

pp$8.parseExportDeclaration = function(node) {
  return this.parseStatement(null)
};

pp$8.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    if (isAsync) { this.next(); }
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync)
  } else if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID")
  } else {
    var declaration = this.parseMaybeAssign();
    this.semicolon();
    return declaration
  }
};

pp$8.checkExport = function(exports, name, pos) {
  if (!exports) { return }
  if (typeof name !== "string")
    { name = name.type === "Identifier" ? name.name : name.value; }
  if (hasOwn(exports, name))
    { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
  exports[name] = true;
};

pp$8.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier")
    { this.checkExport(exports, pat, pat.start); }
  else if (type === "ObjectPattern")
    { for (var i = 0, list = pat.properties; i < list.length; i += 1)
      {
        var prop = list[i];

        this.checkPatternExport(exports, prop);
      } }
  else if (type === "ArrayPattern")
    { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];

        if (elt) { this.checkPatternExport(exports, elt); }
    } }
  else if (type === "Property")
    { this.checkPatternExport(exports, pat.value); }
  else if (type === "AssignmentPattern")
    { this.checkPatternExport(exports, pat.left); }
  else if (type === "RestElement")
    { this.checkPatternExport(exports, pat.argument); }
};

pp$8.checkVariableExport = function(exports, decls) {
  if (!exports) { return }
  for (var i = 0, list = decls; i < list.length; i += 1)
    {
    var decl = list[i];

    this.checkPatternExport(exports, decl.id);
  }
};

pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" ||
    this.type.keyword === "const" ||
    this.type.keyword === "class" ||
    this.type.keyword === "function" ||
    this.isLet() ||
    this.isAsyncFunction()
};

// Parses a comma-separated list of module exports.

pp$8.parseExportSpecifier = function(exports) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();

  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(
    exports,
    node.exported,
    node.exported.start
  );

  return this.finishNode(node, "ExportSpecifier")
};

pp$8.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  // export { x, y as z } [from '...']
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) { break }
    } else { first = false; }

    nodes.push(this.parseExportSpecifier(exports));
  }
  return nodes
};

// Parses import declaration.

pp$8.parseImport = function(node) {
  this.next();

  // import '...'
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration")
};

// Parses a comma-separated list of module imports.

pp$8.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();

  if (this.eatContextual("as")) {
    node.local = this.parseIdent();
  } else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);

  return this.finishNode(node, "ImportSpecifier")
};

pp$8.parseImportDefaultSpecifier = function() {
  // import defaultObj, { x, y as z } from '...'
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier")
};

pp$8.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier")
};

pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) { return nodes }
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) { break }
    } else { first = false; }

    nodes.push(this.parseImportSpecifier());
  }
  return nodes
};

pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral
  }
  return this.parseIdent(true)
};

// Set `ExpressionStatement#directive` property for directive prologues.
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
    statements[i].directive = statements[i].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return (
    this.options.ecmaVersion >= 5 &&
    statement.type === "ExpressionStatement" &&
    statement.expression.type === "Literal" &&
    typeof statement.expression.value === "string" &&
    // Reject parenthesized strings.
    (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
  )
};

var pp$7 = Parser.prototype;

// Convert existing expression atom to assignable pattern
// if possible.

pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
    case "Identifier":
      if (this.inAsync && node.name === "await")
        { this.raise(node.start, "Cannot use 'await' as identifier inside an async function"); }
      break

    case "ObjectPattern":
    case "ArrayPattern":
    case "AssignmentPattern":
    case "RestElement":
      break

    case "ObjectExpression":
      node.type = "ObjectPattern";
      if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
      for (var i = 0, list = node.properties; i < list.length; i += 1) {
        var prop = list[i];

      this.toAssignable(prop, isBinding);
        // Early error:
        //   AssignmentRestProperty[Yield, Await] :
        //     `...` DestructuringAssignmentTarget[Yield, Await]
        //
        //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
        if (
          prop.type === "RestElement" &&
          (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
        ) {
          this.raise(prop.argument.start, "Unexpected token");
        }
      }
      break

    case "Property":
      // AssignmentProperty has type === "Property"
      if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
      this.toAssignable(node.value, isBinding);
      break

    case "ArrayExpression":
      node.type = "ArrayPattern";
      if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
      this.toAssignableList(node.elements, isBinding);
      break

    case "SpreadElement":
      node.type = "RestElement";
      this.toAssignable(node.argument, isBinding);
      if (node.argument.type === "AssignmentPattern")
        { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
      break

    case "AssignmentExpression":
      if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
      node.type = "AssignmentPattern";
      delete node.operator;
      this.toAssignable(node.left, isBinding);
      break

    case "ParenthesizedExpression":
      this.toAssignable(node.expression, isBinding, refDestructuringErrors);
      break

    case "ChainExpression":
      this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
      break

    case "MemberExpression":
      if (!isBinding) { break }

    default:
      this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
  return node
};

// Convert list of expression atoms to binding list.

pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    if (elt) { this.toAssignable(elt, isBinding); }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
      { this.unexpected(last.argument.start); }
  }
  return exprList
};

// Parses spread element.

pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement")
};

pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();

  // RestElement inside of a function parameter must be an identifier
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name)
    { this.unexpected(); }

  node.argument = this.parseBindingAtom();

  return this.finishNode(node, "RestElement")
};

// Parses lvalue (assignable) atom.

pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
    case types$1.bracketL:
      var node = this.startNode();
      this.next();
      node.elements = this.parseBindingList(types$1.bracketR, true, true);
      return this.finishNode(node, "ArrayPattern")

    case types$1.braceL:
      return this.parseObj(true)
    }
  }
  return this.parseIdent()
};

pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) { first = false; }
    else { this.expect(types$1.comma); }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) { this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"); }
      this.expect(close);
      break
    } else {
      elts.push(this.parseAssignableListItem(allowModifiers));
    }
  }
  return elts
};

pp$7.parseAssignableListItem = function(allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem
};

pp$7.parseBindingListItem = function(param) {
  return param
};

// Parses assignment pattern around given atom if possible.

pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) { return left }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern")
};

// The following three functions all verify that a node is an lvalue \u2014
// something that can be bound, or assigned to. In order to do so, they perform
// a variety of checks:
//
// - Check that none of the bound/assigned-to identifiers are reserved words.
// - Record name declarations for bindings in the appropriate scope.
// - Check duplicate argument names, if checkClashes is set.
//
// If a complex binding pattern is encountered (e.g., object and array
// destructuring), the entire pattern is recursively checked.
//
// There are three versions of checkLVal*() appropriate for different
// circumstances:
//
// - checkLValSimple() shall be used if the syntactic construct supports
//   nothing other than identifiers and member expressions. Parenthesized
//   expressions are also correctly handled. This is generally appropriate for
//   constructs for which the spec says
//
//   > It is a Syntax Error if AssignmentTargetType of [the production] is not
//   > simple.
//
//   It is also appropriate for checking if an identifier is valid and not
//   defined elsewhere, like import declarations or function/class identifiers.
//
//   Examples where this is used include:
//     a += …;
//     import a from '…';
//   where a is the node to be checked.
//
// - checkLValPattern() shall be used if the syntactic construct supports
//   anything checkLValSimple() supports, as well as object and array
//   destructuring patterns. This is generally appropriate for constructs for
//   which the spec says
//
//   > It is a Syntax Error if [the production] is neither an ObjectLiteral nor
//   > an ArrayLiteral and AssignmentTargetType of [the production] is not
//   > simple.
//
//   Examples where this is used include:
//     (a = …);
//     const a = …;
//     try { … } catch (a) { … }
//   where a is the node to be checked.
//
// - checkLValInnerPattern() shall be used if the syntactic construct supports
//   anything checkLValPattern() supports, as well as default assignment
//   patterns, rest elements, and other constructs that may appear within an
//   object or array destructuring pattern.
//
//   As a special case, function parameters also use checkLValInnerPattern(),
//   as they also support defaults and rest constructs.
//
// These functions deliberately support both assignment and binding constructs,
// as the logic for both is exceedingly similar. If the node is the target of
// an assignment, then bindingType should be set to BIND_NONE. Otherwise, it
// should be set to the appropriate BIND_* constant, like BIND_VAR or
// BIND_LEXICAL.
//
// If the function is called with a non-BIND_NONE bindingType, then
// additionally a checkClashes object may be specified to allow checking for
// duplicate argument names. checkClashes is ignored if the provided construct
// is an assignment (i.e., bindingType is BIND_NONE).

pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if ( bindingType === void 0 ) bindingType = BIND_NONE;

  var isBind = bindingType !== BIND_NONE;

  switch (expr.type) {
  case "Identifier":
    if (this.strict && this.reservedWordsStrictBind.test(expr.name))
      { this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
    if (isBind) {
      if (bindingType === BIND_LEXICAL && expr.name === "let")
        { this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"); }
      if (checkClashes) {
        if (hasOwn(checkClashes, expr.name))
          { this.raiseRecoverable(expr.start, "Argument name clash"); }
        checkClashes[expr.name] = true;
      }
      if (bindingType !== BIND_OUTSIDE) { this.declareName(expr.name, bindingType, expr.start); }
    }
    break

  case "ChainExpression":
    this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
    break

  case "MemberExpression":
    if (isBind) { this.raiseRecoverable(expr.start, "Binding member expression"); }
    break

  case "ParenthesizedExpression":
    if (isBind) { this.raiseRecoverable(expr.start, "Binding parenthesized expression"); }
    return this.checkLValSimple(expr.expression, bindingType, checkClashes)

  default:
    this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};

pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if ( bindingType === void 0 ) bindingType = BIND_NONE;

  switch (expr.type) {
  case "ObjectPattern":
    for (var i = 0, list = expr.properties; i < list.length; i += 1) {
      var prop = list[i];

    this.checkLValInnerPattern(prop, bindingType, checkClashes);
    }
    break

  case "ArrayPattern":
    for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
      var elem = list$1[i$1];

    if (elem) { this.checkLValInnerPattern(elem, bindingType, checkClashes); }
    }
    break

  default:
    this.checkLValSimple(expr, bindingType, checkClashes);
  }
};

pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if ( bindingType === void 0 ) bindingType = BIND_NONE;

  switch (expr.type) {
  case "Property":
    // AssignmentProperty has type === "Property"
    this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
    break

  case "AssignmentPattern":
    this.checkLValPattern(expr.left, bindingType, checkClashes);
    break

  case "RestElement":
    this.checkLValPattern(expr.argument, bindingType, checkClashes);
    break

  default:
    this.checkLValPattern(expr, bindingType, checkClashes);
  }
};

// The algorithm used to determine whether a regexp can appear at a
// given point in the program is loosely based on sweet.js' approach.
// See https://github.com/mozilla/sweet.js/wiki/design


var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};

var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};

var pp$6 = Parser.prototype;

pp$6.initialContext = function() {
  return [types.b_stat]
};

pp$6.curContext = function() {
  return this.context[this.context.length - 1]
};

pp$6.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types.f_expr || parent === types.f_stat)
    { return true }
  if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr))
    { return !parent.isExpr }

  // The check for `tt.name && exprAllowed` detects whether we are
  // after a `yield` or `of` construct. See the `updateContext` for
  // `tt.name`.
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed)
    { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow)
    { return true }
  if (prevType === types$1.braceL)
    { return parent === types.b_stat }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name)
    { return false }
  return !this.exprAllowed
};

pp$6.inGeneratorContext = function() {
  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this.context[i];
    if (context.token === "function")
      { return context.generator }
  }
  return false
};

pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot)
    { this.exprAllowed = false; }
  else if (update = type.updateContext)
    { update.call(this, prevType); }
  else
    { this.exprAllowed = type.beforeExpr; }
};

// Used to handle edge cases when token context could not be inferred correctly during tokenization phase

pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};

// Token-specific context update code

types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};

types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};

types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};

types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};

types$1.incDec.updateContext = function() {
  // tokExprAllowed stays unchanged
};

types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else &&
      !(prevType === types$1.semi && this.curContext() !== types.p_stat) &&
      !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
      !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat))
    { this.context.push(types.f_expr); }
  else
    { this.context.push(types.f_stat); }
  this.exprAllowed = false;
};

types$1.colon.updateContext = function() {
  if (this.curContext().token === "function") { this.context.pop(); }
  this.exprAllowed = true;
};

types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl)
    { this.context.pop(); }
  else
    { this.context.push(types.q_tmpl); }
  this.exprAllowed = false;
};

types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr)
      { this.context[index] = types.f_expr_gen; }
    else
      { this.context[index] = types.f_gen; }
  }
  this.exprAllowed = true;
};

types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed ||
        this.value === "yield" && this.inGeneratorContext())
      { allowed = true; }
  }
  this.exprAllowed = allowed;
};

// A recursive descent parser operates by defining functions for all
// syntactic elements, and recursively calling those, each function
// advancing the input stream and returning an AST node. Precedence
// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
// instead of `(!x)[1]` is handled by the fact that the parser
// function that parses unary prefix operators is called first, and
// in turn calls the function that parses `[]` subscripts \u2014 that
// way, it'll receive the node for `x[1]` already parsed, and wraps
// *that* in the unary operator node.
//
// Acorn uses an [operator precedence parser][opp] to handle binary
// operator precedence, because it is much more compact than using
// the technique outlined above, which uses different, nesting
// functions to specify precedence, for all of the ten binary
// precedence levels that JavaScript defines.
//
// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser


var pp$5 = Parser.prototype;

// Check if property name clashes with already added.
// Object/class getters and setters are not allowed to clash \u2014
// either with each other or with an init property \u2014 and in
// strict mode, init properties are also not allowed to be repeated.

pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
    { return }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
    { return }
  var key = prop.key;
  var name;
  switch (key.type) {
  case "Identifier": name = key.name; break
  case "Literal": name = String(key.value); break
  default: return
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition)
      { this.raiseRecoverable(key.start, "Redefinition of property"); }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};

// ### Expression parsing

// These nest, from the most general expression type at the top to
// 'atomic', nondivisible expression types at the bottom. Most of
// the functions will simply let the function(s) below them parse,
// and, *if* the syntactic construct they handle is present, wrap
// the AST node that the inner parser gave them in another node.

// Parse a full expression. The optional arguments are used to
// forbid the `in` operator (in for loops initalization expressions)
// and provide reference for storing '=' operator inside shorthand
// property assignment in contexts where both object expression
// and object pattern might appear (so it's possible to raise
// delayed syntax error at correct position).

pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types$1.comma)) { node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors)); }
    return this.finishNode(node, "SequenceExpression")
  }
  return expr
};

// Parse an assignment expression. This includes applications of
// operators like `+=`.

pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) { return this.parseYield(forInit) }
    // The tokenizer will assume an expression is allowed after
    // `yield`, but this isn't that kind of yield
    else { this.exprAllowed = false; }
  }

  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors;
    ownDestructuringErrors = true;
  }

  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq)
      { left = this.toAssignable(left, false, refDestructuringErrors); }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start)
      { refDestructuringErrors.shorthandAssign = -1; } // reset because shorthand default was used correctly
    if (this.type === types$1.eq)
      { this.checkLValPattern(left); }
    else
      { this.checkLValSimple(left); }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) { refDestructuringErrors.doubleProto = oldDoubleProto; }
    return this.finishNode(node, "AssignmentExpression")
  } else {
    if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
  }
  if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
  if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
  return left
};

// Parse a ternary conditional (`?:`) operator.

pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression")
  }
  return expr
};

// Start the precedence parser.

pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit)
};

// Parse binary operators with the operator precedence parsing
// algorithm. `left` is the left-hand side of the operator.
// `minPrec` provides context that allows the function to stop and
// defer further parser to one of its callers when it encounters an
// operator that has a lower precedence than the set it is parsing.

pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
        // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
        prec = types$1.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if ((logical && this.type === types$1.coalesce) || (coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND))) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit)
    }
  }
  return left
};

pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  if (right.type === "PrivateIdentifier") { this.raise(right.start, "Private identifier can only be left side of binary expression"); }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
};

// Parse unary operators, both prefix and postfix.

pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) { this.checkLValSimple(node.argument); }
    else if (this.strict && node.operator === "delete" &&
             node.argument.type === "Identifier")
      { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
    else if (node.operator === "delete" && isPrivateFieldAccess(node.argument))
      { this.raiseRecoverable(node.start, "Private fields can not be deleted"); }
    else { sawUnary = true; }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) { this.unexpected(); }
    expr = this.parsePrivateIdent();
    // only could be private fields in 'in', such as #x in obj
    if (this.type !== types$1._in) { this.unexpected(); }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }

  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary)
      { this.unexpected(this.lastTokStart); }
    else
      { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false) }
  } else {
    return expr
  }
};

function isPrivateFieldAccess(node) {
  return (
    node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" ||
    node.type === "ChainExpression" && isPrivateFieldAccess(node.expression)
  )
}

// Parse call, dot, and `[]`-subscript expressions.

pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
    { return expr }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
    if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
    if (refDestructuringErrors.trailingComma >= result.start) { refDestructuringErrors.trailingComma = -1; }
  }
  return result
};

pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
      this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 &&
      this.potentialArrowAt === base.start;
  var optionalChained = false;

  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);

    if (element.optional) { optionalChained = true; }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element
    }

    base = element;
  }
};

pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow)
};

pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit)
};

pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) { this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions"); }

  var computed = this.eat(types$1.bracketL);
  if (computed || (optional && this.type !== types$1.parenL && this.type !== types$1.backQuote) || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0)
        { this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"); }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit)
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({isTagged: true});
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base
};

// Parse an atomic expression \u2014 either a single token that is an
// expression, an expression started by a keyword like `function` or
// `new`, or an expression wrapped in punctuation like `()`, `[]`,
// or `{}`.

pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  // If a division operator appears in an expression position, the
  // tokenizer got confused, and we force it to read a regexp instead.
  if (this.type === types$1.slash) { this.readRegexp(); }

  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
  case types$1._super:
    if (!this.allowSuper)
      { this.raise(this.start, "'super' keyword outside a method"); }
    node = this.startNode();
    this.next();
    if (this.type === types$1.parenL && !this.allowDirectSuper)
      { this.raise(node.start, "super() call outside constructor of a subclass"); }
    // The `super` keyword can appear at below:
    // SuperProperty:
    //     super [ Expression ]
    //     super . IdentifierName
    // SuperCall:
    //     super ( Arguments )
    if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL)
      { this.unexpected(); }
    return this.finishNode(node, "Super")

  case types$1._this:
    node = this.startNode();
    this.next();
    return this.finishNode(node, "ThisExpression")

  case types$1.name:
    var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
    var id = this.parseIdent(false);
    if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
      this.overrideContext(types.f_expr);
      return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit)
    }
    if (canBeArrow && !this.canInsertSemicolon()) {
      if (this.eat(types$1.arrow))
        { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit) }
      if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc &&
          (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
        id = this.parseIdent(false);
        if (this.canInsertSemicolon() || !this.eat(types$1.arrow))
          { this.unexpected(); }
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit)
      }
    }
    return id

  case types$1.regexp:
    var value = this.value;
    node = this.parseLiteral(value.value);
    node.regex = {pattern: value.pattern, flags: value.flags};
    return node

  case types$1.num: case types$1.string:
    return this.parseLiteral(this.value)

  case types$1._null: case types$1._true: case types$1._false:
    node = this.startNode();
    node.value = this.type === types$1._null ? null : this.type === types$1._true;
    node.raw = this.type.keyword;
    this.next();
    return this.finishNode(node, "Literal")

  case types$1.parenL:
    var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
    if (refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
        { refDestructuringErrors.parenthesizedAssign = start; }
      if (refDestructuringErrors.parenthesizedBind < 0)
        { refDestructuringErrors.parenthesizedBind = start; }
    }
    return expr

  case types$1.bracketL:
    node = this.startNode();
    this.next();
    node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
    return this.finishNode(node, "ArrayExpression")

  case types$1.braceL:
    this.overrideContext(types.b_expr);
    return this.parseObj(false, refDestructuringErrors)

  case types$1._function:
    node = this.startNode();
    this.next();
    return this.parseFunction(node, 0)

  case types$1._class:
    return this.parseClass(this.startNode(), false)

  case types$1._new:
    return this.parseNew()

  case types$1.backQuote:
    return this.parseTemplate()

  case types$1._import:
    if (this.options.ecmaVersion >= 11) {
      return this.parseExprImport(forNew)
    } else {
      return this.unexpected()
    }

  default:
    return this.parseExprAtomDefault()
  }
};

pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};

pp$5.parseExprImport = function(forNew) {
  var node = this.startNode();

  // Consume `import` as an identifier for `import.meta`.
  // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.
  if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword import"); }
  this.next();

  if (this.type === types$1.parenL && !forNew) {
    return this.parseDynamicImport(node)
  } else if (this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "import";
    node.meta = this.finishNode(meta, "Identifier");
    return this.parseImportMeta(node)
  } else {
    this.unexpected();
  }
};

pp$5.parseDynamicImport = function(node) {
  this.next(); // skip `(`

  // Parse node.source.
  node.source = this.parseMaybeAssign();

  // Verify ending.
  if (!this.eat(types$1.parenR)) {
    var errorPos = this.start;
    if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
      this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
    } else {
      this.unexpected(errorPos);
    }
  }

  return this.finishNode(node, "ImportExpression")
};

pp$5.parseImportMeta = function(node) {
  this.next(); // skip `.`

  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);

  if (node.property.name !== "meta")
    { this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'"); }
  if (containsEsc)
    { this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters"); }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere)
    { this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module"); }

  return this.finishNode(node, "MetaProperty")
};

pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) { node.bigint = node.raw.slice(0, -1).replace(/_/g, ""); }
  this.next();
  return this.finishNode(node, "Literal")
};

pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val
};

pp$5.shouldParseArrow = function(exprList) {
  return !this.canInsertSemicolon()
};

pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();

    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    // Do not save awaitIdentPos to allow checking awaits nested in parameters
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raiseRecoverable(
            this.start,
            "Comma is not permitted after the rest element"
          );
        }
        break
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);

    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit)
    }

    if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
    if (spreadStart) { this.unexpected(spreadStart); }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;

    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }

  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression")
  } else {
    return val
  }
};

pp$5.parseParenItem = function(item) {
  return item
};

pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit)
};

// New's precedence is slightly tricky. It must allow its argument to
// be a `[]` or dot subscript expression, but not a call \u2014 at least,
// not without wrapping it in parentheses. Thus, it uses the noCalls
// argument to parseSubscripts to prevent it from consuming the
// argument list.

var empty = [];

pp$5.parseNew = function() {
  if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword new"); }
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta.name = "new";
    node.meta = this.finishNode(meta, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target")
      { this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'"); }
    if (containsEsc)
      { this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters"); }
    if (!this.allowNewDotTarget)
      { this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block"); }
    return this.finishNode(node, "MetaProperty")
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  if (this.eat(types$1.parenL)) { node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false); }
  else { node.arguments = empty; }
  return this.finishNode(node, "NewExpression")
};

// Parse template expression.

pp$5.parseTemplateElement = function(ref) {
  var isTagged = ref.isTagged;

  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value,
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement")
};

pp$5.parseTemplate = function(ref) {
  if ( ref === void 0 ) ref = {};
  var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;

  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({isTagged: isTagged});
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) { this.raise(this.pos, "Unterminated template literal"); }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({isTagged: isTagged}));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral")
};

pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
    (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
    !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
};

// Parse an object literal or binding pattern.

pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) { break }
    } else { first = false; }

    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) { this.checkPropClash(prop, propHash, refDestructuringErrors); }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
};

pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement")
    }
    // Parse argument.
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    // To disallow trailing comma via `this.toAssignable()`.
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    // Finish
    return this.finishNode(prop, "SpreadElement")
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern)
      { isGenerator = this.eat(types$1.star); }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property")
};

pp$5.parseGetterSetter = function(prop) {
  prop.kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start = prop.value.start;
    if (prop.kind === "get")
      { this.raiseRecoverable(start, "getter should have no params"); }
    else
      { this.raiseRecoverable(start, "setter should have exactly one param"); }
  } else {
    if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
      { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
  }
};

pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon)
    { this.unexpected(); }

  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) { this.unexpected(); }
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (!isPattern && !containsEsc &&
             this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
             (prop.key.name === "get" || prop.key.name === "set") &&
             (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator || isAsync) { this.unexpected(); }
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) { this.unexpected(); }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos)
      { this.awaitIdentPos = startPos; }
    prop.kind = "init";
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0)
        { refDestructuringErrors.shorthandAssign = this.start; }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.shorthand = true;
  } else { this.unexpected(); }
};

pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never")
};

// Initialize empty function node.

pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) { node.generator = node.expression = false; }
  if (this.options.ecmaVersion >= 8) { node.async = false; }
};

// Parse object or class method.

pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

  this.initFunction(node);
  if (this.options.ecmaVersion >= 6)
    { node.generator = isGenerator; }
  if (this.options.ecmaVersion >= 8)
    { node.async = !!isAsync; }

  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));

  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression")
};

// Parse arrow function expression with given parameters.

pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) { node.async = !!isAsync; }

  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;

  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);

  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression")
};

// Parse function body and check parameters.

pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;

  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      // If this is a strict mode function, verify that argument names
      // are not repeated, and it does not try to bind the words `eval`
      // or `arguments`.
      if (useStrict && nonSimple)
        { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
    }
    // Start a new scope with regard to labels and the `inFunction`
    // flag (restore them to their old value afterwards).
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) { this.strict = true; }

    // Add the params to varDeclaredNames to ensure that an error is thrown
    // if a let/const declaration in the function clashes with one of the params.
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
    if (this.strict && node.id) { this.checkLValSimple(node.id, BIND_OUTSIDE); }
    node.body = this.parseBlock(false, undefined, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};

pp$5.isSimpleParamList = function(params) {
  for (var i = 0, list = params; i < list.length; i += 1)
    {
    var param = list[i];

    if (param.type !== "Identifier") { return false
  } }
  return true
};

// Checks function params for various disallowed patterns such as using "eval"
// or "arguments" and duplicate parameters.

pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash = Object.create(null);
  for (var i = 0, list = node.params; i < list.length; i += 1)
    {
    var param = list[i];

    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};

// Parses a comma-separated list of expressions, and returns them as
// an array. `close` is the token type that ends the list, and
// `allowEmpty` can be turned on to allow subsequent commas with
// nothing in between them to be parsed as `null` (which is needed
// for array literals).

pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) { break }
    } else { first = false; }

    var elt = (void 0);
    if (allowEmpty && this.type === types$1.comma)
      { elt = null; }
    else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0)
        { refDestructuringErrors.trailingComma = this.start; }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts
};

pp$5.checkUnreserved = function(ref) {
  var start = ref.start;
  var end = ref.end;
  var name = ref.name;

  if (this.inGenerator && name === "yield")
    { this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"); }
  if (this.inAsync && name === "await")
    { this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"); }
  if (this.currentThisScope().inClassFieldInit && name === "arguments")
    { this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer"); }
  if (this.inClassStaticBlock && (name === "arguments" || name === "await"))
    { this.raise(start, ("Cannot use " + name + " in class static initialization block")); }
  if (this.keywords.test(name))
    { this.raise(start, ("Unexpected keyword '" + name + "'")); }
  if (this.options.ecmaVersion < 6 &&
    this.input.slice(start, end).indexOf("\\") !== -1) { return }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"); }
    this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
  }
};

// Parse the next token as an identifier. If `liberal` is true (used
// when parsing properties), it will also convert keywords into
// identifiers.

pp$5.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos)
      { this.awaitIdentPos = node.start; }
  }
  return node
};

pp$5.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;

    // To fix https://github.com/acornjs/acorn/issues/575
    // `class` and `function` keywords push new context into this.context.
    // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
    // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
    if ((node.name === "class" || node.name === "function") &&
      (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
    this.type = types$1.name;
  } else {
    this.unexpected();
  }
  return node
};

pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");

  // For validating existence
  if (this.options.checkPrivateFields) {
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, ("Private field '#" + (node.name) + "' must be declared in an enclosing class"));
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }
  }

  return node
};

// Parses yield expression inside generator.

pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) { this.yieldPos = this.start; }

  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || (this.type !== types$1.star && !this.type.startsExpr)) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression")
};

pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) { this.awaitPos = this.start; }

  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression")
};

var pp$4 = Parser.prototype;

// This function is used to raise exceptions on parse errors. It
// takes an offset integer (into the current `input`) to indicate
// the location of the error, attaches the position to the end
// of the error message, and then raises a `SyntaxError` with that
// message.

pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
  throw err
};

pp$4.raiseRecoverable = pp$4.raise;

pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart)
  }
};

var pp$3 = Parser.prototype;

var Scope = function Scope(flags) {
  this.flags = flags;
  // A list of var-declared names in the current lexical scope
  this.var = [];
  // A list of lexically-declared names in the current lexical scope
  this.lexical = [];
  // A list of lexically-declared FunctionDeclaration names in the current lexical scope
  this.functions = [];
  // A switch to disallow the identifier reference 'arguments'
  this.inClassFieldInit = false;
};

// The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.

pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};

pp$3.exitScope = function() {
  this.scopeStack.pop();
};

// The spec says:
// > At the top level of a function, or script, function declarations are
// > treated like var declarations rather than like lexical declarations.
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)
};

pp$3.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && (scope.flags & SCOPE_TOP))
      { delete this.undefinedExports[name]; }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar)
      { redeclared = scope$2.lexical.indexOf(name) > -1; }
    else
      { redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1; }
    scope$2.functions.push(name);
  } else {
    for (var i = this.scopeStack.length - 1; i >= 0; --i) {
      var scope$3 = this.scopeStack[i];
      if (scope$3.lexical.indexOf(name) > -1 && !((scope$3.flags & SCOPE_SIMPLE_CATCH) && scope$3.lexical[0] === name) ||
          !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break
      }
      scope$3.var.push(name);
      if (this.inModule && (scope$3.flags & SCOPE_TOP))
        { delete this.undefinedExports[name]; }
      if (scope$3.flags & SCOPE_VAR) { break }
    }
  }
  if (redeclared) { this.raiseRecoverable(pos, ("Identifier '" + name + "' has already been declared")); }
};

pp$3.checkLocalExport = function(id) {
  // scope.functions must be empty as Module code is always strict.
  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
      this.scopeStack[0].var.indexOf(id.name) === -1) {
    this.undefinedExports[id.name] = id;
  }
};

pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1]
};

pp$3.currentVarScope = function() {
  for (var i = this.scopeStack.length - 1;; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR) { return scope }
  }
};

// Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
pp$3.currentThisScope = function() {
  for (var i = this.scopeStack.length - 1;; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) { return scope }
  }
};

var Node = function Node(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations)
    { this.loc = new SourceLocation(parser, loc); }
  if (parser.options.directSourceFile)
    { this.sourceFile = parser.options.directSourceFile; }
  if (parser.options.ranges)
    { this.range = [pos, 0]; }
};

// Start an AST node, attaching a start offset.

var pp$2 = Parser.prototype;

pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc)
};

pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc)
};

// Finish an AST node, adding `type` and `end` properties.

function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations)
    { node.loc.end = loc; }
  if (this.options.ranges)
    { node.range[1] = pos; }
  return node
}

pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
};

// Finish node at given position

pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc)
};

pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) { newNode[prop] = node[prop]; }
  return newNode
};

// This file contains Unicode properties extracted from the ECMAScript specification.
// The lists are extracted like so:
// $$('#table-binary-unicode-properties > figure > table > tbody > tr > td:nth-child(1) code').map(el => el.innerText)

// #table-binary-unicode-properties
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;

var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};

// #table-binary-unicode-properties-of-strings
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";

var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};

// #table-unicode-general-category-values
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";

// #table-unicode-script-values
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " Hrkt Katakana_Or_Hiragana Kawi Nag_Mundari Nagm Unknown Zzzz";

var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};

var data = {};
function buildUnicodeData(ecmaVersion) {
  var d = data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;

  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}

for (var i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1) {
  var ecmaVersion = list[i];

  buildUnicodeData(ecmaVersion);
}

var pp$1 = Parser.prototype;

var RegExpValidationState = function RegExpValidationState(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = [];
  this.backReferenceNames = [];
};

RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
  var unicodeSets = flags.indexOf("v") !== -1;
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
};

RegExpValidationState.prototype.raise = function raise (message) {
  this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
};

// If u flag is given, this returns the code point at the index (it combines a surrogate pair).
// Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
RegExpValidationState.prototype.at = function at (i, forceU) {
    if ( forceU === void 0 ) forceU = false;

  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return -1
  }
  var c = s.charCodeAt(i);
  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
    return c
  }
  var next = s.charCodeAt(i + 1);
  return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c
};

RegExpValidationState.prototype.nextIndex = function nextIndex (i, forceU) {
    if ( forceU === void 0 ) forceU = false;

  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return l
  }
  var c = s.charCodeAt(i), next;
  if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
      (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) {
    return i + 1
  }
  return i + 2
};

RegExpValidationState.prototype.current = function current (forceU) {
    if ( forceU === void 0 ) forceU = false;

  return this.at(this.pos, forceU)
};

RegExpValidationState.prototype.lookahead = function lookahead (forceU) {
    if ( forceU === void 0 ) forceU = false;

  return this.at(this.nextIndex(this.pos, forceU), forceU)
};

RegExpValidationState.prototype.advance = function advance (forceU) {
    if ( forceU === void 0 ) forceU = false;

  this.pos = this.nextIndex(this.pos, forceU);
};

RegExpValidationState.prototype.eat = function eat (ch, forceU) {
    if ( forceU === void 0 ) forceU = false;

  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true
  }
  return false
};

RegExpValidationState.prototype.eatChars = function eatChars (chs, forceU) {
    if ( forceU === void 0 ) forceU = false;

  var pos = this.pos;
  for (var i = 0, list = chs; i < list.length; i += 1) {
    var ch = list[i];

      var current = this.at(pos, forceU);
    if (current === -1 || current !== ch) {
      return false
    }
    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true
};

/**
 * Validate the flags part of a given RegExpLiteral.
 *
 * @param {RegExpValidationState} state The state to validate RegExp.
 * @returns {void}
 */
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;

  var u = false;
  var v = false;

  for (var i = 0; i < flags.length; i++) {
    var flag = flags.charAt(i);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
    if (flag === "u") { u = true; }
    if (flag === "v") { v = true; }
  }
  if (this.options.ecmaVersion >= 15 && u && v) {
    this.raise(state.start, "Invalid regular expression flag");
  }
};

/**
 * Validate the pattern part of a given RegExpLiteral.
 *
 * @param {RegExpValidationState} state The state to validate RegExp.
 * @returns {void}
 */
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);

  // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
  // parsing contains a |GroupName|, reparse with the goal symbol
  // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
  // exception if _P_ did not conform to the grammar, if any elements of _P_
  // were not matched by the parse, or if any Early Error conditions exist.
  if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames.length = 0;
  state.backReferenceNames.length = 0;

  this.regexp_disjunction(state);

  if (state.pos !== state.source.length) {
    // Make the same messages as V8.
    if (state.eat(0x29 /* ) */)) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(0x5D /* ] */) || state.eat(0x7D /* } */)) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
    var name = list[i];

    if (state.groupNames.indexOf(name) === -1) {
      state.raise("Invalid named capture referenced");
    }
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
pp$1.regexp_disjunction = function(state) {
  this.regexp_alternative(state);
  while (state.eat(0x7C /* | */)) {
    this.regexp_alternative(state);
  }

  // Make the same message as V8.
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(0x7B /* { */)) {
    state.raise("Lone quantifier brackets");
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state))
    { }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    // Handle `QuantifiableAssertion Quantifier` alternative.
    // `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
    // is a QuantifiableAssertion.
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      // Make the same message as V8.
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true
  }

  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true
  }

  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;

  // ^, $
  if (state.eat(0x5E /* ^ */) || state.eat(0x24 /* $ */)) {
    return true
  }

  // \b \B
  if (state.eat(0x5C /* \ */)) {
    if (state.eat(0x42 /* B */) || state.eat(0x62 /* b */)) {
      return true
    }
    state.pos = start;
  }

  // Lookahead / Lookbehind
  if (state.eat(0x28 /* ( */) && state.eat(0x3F /* ? */)) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(0x3C /* < */);
    }
    if (state.eat(0x3D /* = */) || state.eat(0x21 /* ! */)) {
      this.regexp_disjunction(state);
      if (!state.eat(0x29 /* ) */)) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true
    }
  }

  state.pos = start;
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
pp$1.regexp_eatQuantifier = function(state, noError) {
  if ( noError === void 0 ) noError = false;

  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(0x3F /* ? */);
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return (
    state.eat(0x2A /* * */) ||
    state.eat(0x2B /* + */) ||
    state.eat(0x3F /* ? */) ||
    this.regexp_eatBracedQuantifier(state, noError)
  )
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(0x7B /* { */)) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(0x2C /* , */) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(0x7D /* } */)) {
        // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
pp$1.regexp_eatAtom = function(state) {
  return (
    this.regexp_eatPatternCharacters(state) ||
    state.eat(0x2E /* . */) ||
    this.regexp_eatReverseSolidusAtomEscape(state) ||
    this.regexp_eatCharacterClass(state) ||
    this.regexp_eatUncapturingGroup(state) ||
    this.regexp_eatCapturingGroup(state)
  )
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(0x5C /* \ */)) {
    if (this.regexp_eatAtomEscape(state)) {
      return true
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(0x28 /* ( */)) {
    if (state.eat(0x3F /* ? */) && state.eat(0x3A /* : */)) {
      this.regexp_disjunction(state);
      if (state.eat(0x29 /* ) */)) {
        return true
      }
      state.raise("Unterminated group");
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(0x28 /* ( */)) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 0x3F /* ? */) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(0x29 /* ) */)) {
      state.numCapturingParens += 1;
      return true
    }
    state.raise("Unterminated group");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
pp$1.regexp_eatExtendedAtom = function(state) {
  return (
    state.eat(0x2E /* . */) ||
    this.regexp_eatReverseSolidusAtomEscape(state) ||
    this.regexp_eatCharacterClass(state) ||
    this.regexp_eatUncapturingGroup(state) ||
    this.regexp_eatCapturingGroup(state) ||
    this.regexp_eatInvalidBracedQuantifier(state) ||
    this.regexp_eatExtendedPatternCharacter(state)
  )
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }
  return false
};
function isSyntaxCharacter(ch) {
  return (
    ch === 0x24 /* $ */ ||
    ch >= 0x28 /* ( */ && ch <= 0x2B /* + */ ||
    ch === 0x2E /* . */ ||
    ch === 0x3F /* ? */ ||
    ch >= 0x5B /* [ */ && ch <= 0x5E /* ^ */ ||
    ch >= 0x7B /* { */ && ch <= 0x7D /* } */
  )
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
// But eat eager.
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (
    ch !== -1 &&
    ch !== 0x24 /* $ */ &&
    !(ch >= 0x28 /* ( */ && ch <= 0x2B /* + */) &&
    ch !== 0x2E /* . */ &&
    ch !== 0x3F /* ? */ &&
    ch !== 0x5B /* [ */ &&
    ch !== 0x5E /* ^ */ &&
    ch !== 0x7C /* | */
  ) {
    state.advance();
    return true
  }
  return false
};

// GroupSpecifier ::
//   [empty]
//   `?` GroupName
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(0x3F /* ? */)) {
    if (this.regexp_eatGroupName(state)) {
      if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
        state.raise("Duplicate capture group name");
      }
      state.groupNames.push(state.lastStringValue);
      return
    }
    state.raise("Invalid group");
  }
};

// GroupName ::
//   `<` RegExpIdentifierName `>`
// Note: this updates `state.lastStringValue` property with the eaten name.
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(0x3C /* < */)) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */)) {
      return true
    }
    state.raise("Invalid capture group name");
  }
  return false
};

// RegExpIdentifierName ::
//   RegExpIdentifierStart
//   RegExpIdentifierName RegExpIdentifierPart
// Note: this updates `state.lastStringValue` property with the eaten name.
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true
  }
  return false
};

// RegExpIdentifierStart ::
//   UnicodeIDStart
//   `$`
//   `_`
//   `\` RegExpUnicodeEscapeSequence[+U]
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);

  if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true
  }

  state.pos = start;
  return false
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */
}

// RegExpIdentifierPart ::
//   UnicodeIDContinue
//   `$`
//   `_`
//   `\` RegExpUnicodeEscapeSequence[+U]
//   <ZWNJ>
//   <ZWJ>
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);

  if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true
  }

  state.pos = start;
  return false
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */ || ch === 0x200C /* <ZWNJ> */ || ch === 0x200D /* <ZWJ> */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
pp$1.regexp_eatAtomEscape = function(state) {
  if (
    this.regexp_eatBackReference(state) ||
    this.regexp_eatCharacterClassEscape(state) ||
    this.regexp_eatCharacterEscape(state) ||
    (state.switchN && this.regexp_eatKGroupName(state))
  ) {
    return true
  }
  if (state.switchU) {
    // Make the same message as V8.
    if (state.current() === 0x63 /* c */) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true
    }
    if (n <= state.numCapturingParens) {
      return true
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(0x6B /* k */)) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true
    }
    state.raise("Invalid named reference");
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
pp$1.regexp_eatCharacterEscape = function(state) {
  return (
    this.regexp_eatControlEscape(state) ||
    this.regexp_eatCControlLetter(state) ||
    this.regexp_eatZero(state) ||
    this.regexp_eatHexEscapeSequence(state) ||
    this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
    (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
    this.regexp_eatIdentityEscape(state)
  )
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(0x63 /* c */)) {
    if (this.regexp_eatControlLetter(state)) {
      return true
    }
    state.pos = start;
  }
  return false
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 0x30 /* 0 */ && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
pp$1.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 0x74 /* t */) {
    state.lastIntValue = 0x09; /* \t */
    state.advance();
    return true
  }
  if (ch === 0x6E /* n */) {
    state.lastIntValue = 0x0A; /* \n */
    state.advance();
    return true
  }
  if (ch === 0x76 /* v */) {
    state.lastIntValue = 0x0B; /* \v */
    state.advance();
    return true
  }
  if (ch === 0x66 /* f */) {
    state.lastIntValue = 0x0C; /* \f */
    state.advance();
    return true
  }
  if (ch === 0x72 /* r */) {
    state.lastIntValue = 0x0D; /* \r */
    state.advance();
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
pp$1.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 0x20;
    state.advance();
    return true
  }
  return false
};
function isControlLetter(ch) {
  return (
    (ch >= 0x41 /* A */ && ch <= 0x5A /* Z */) ||
    (ch >= 0x61 /* a */ && ch <= 0x7A /* z */)
  )
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if ( forceU === void 0 ) forceU = false;

  var start = state.pos;
  var switchU = forceU || state.switchU;

  if (state.eat(0x75 /* u */)) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(0x5C /* \ */) && state.eat(0x75 /* u */) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 0xDC00 && trail <= 0xDFFF) {
            state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
            return true
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true
    }
    if (
      switchU &&
      state.eat(0x7B /* { */) &&
      this.regexp_eatHexDigits(state) &&
      state.eat(0x7D /* } */) &&
      isValidUnicode(state.lastIntValue)
    ) {
      return true
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }

  return false
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 0x10FFFF
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true
    }
    if (state.eat(0x2F /* / */)) {
      state.lastIntValue = 0x2F; /* / */
      return true
    }
    return false
  }

  var ch = state.current();
  if (ch !== 0x63 /* c */ && (!state.switchN || ch !== 0x6B /* k */)) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }

  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 0x31 /* 1 */ && ch <= 0x39 /* 9 */) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
      state.advance();
    } while ((ch = state.current()) >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */)
    return true
  }
  return false
};

// Return values used by character set parsing methods, needed to
// forbid negation of sets that can match strings.
var CharSetNone = 0; // Nothing parsed
var CharSetOk = 1; // Construct parsed, cannot contain strings
var CharSetString = 2; // Construct parsed, can contain strings

// https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();

  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk
  }

  var negate = false;
  if (
    state.switchU &&
    this.options.ecmaVersion >= 9 &&
    ((negate = ch === 0x50 /* P */) || ch === 0x70 /* p */)
  ) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (
      state.eat(0x7B /* { */) &&
      (result = this.regexp_eatUnicodePropertyValueExpression(state)) &&
      state.eat(0x7D /* } */)
    ) {
      if (negate && result === CharSetString) { state.raise("Invalid property name"); }
      return result
    }
    state.raise("Invalid property name");
  }

  return CharSetNone
};

function isCharacterClassEscape(ch) {
  return (
    ch === 0x64 /* d */ ||
    ch === 0x44 /* D */ ||
    ch === 0x73 /* s */ ||
    ch === 0x53 /* S */ ||
    ch === 0x77 /* w */ ||
    ch === 0x57 /* W */
  )
}

// UnicodePropertyValueExpression ::
//   UnicodePropertyName `=` UnicodePropertyValue
//   LoneUnicodePropertyNameOrValue
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;

  // UnicodePropertyName `=` UnicodePropertyValue
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */)) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return CharSetOk
    }
  }
  state.pos = start;

  // LoneUnicodePropertyNameOrValue
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue)
  }
  return CharSetNone
};

pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name))
    { state.raise("Invalid property name"); }
  if (!state.unicodeProperties.nonBinary[name].test(value))
    { state.raise("Invalid property value"); }
};

pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) { return CharSetOk }
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) { return CharSetString }
  state.raise("Invalid property name");
};

// UnicodePropertyName ::
//   UnicodePropertyNameCharacters
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== ""
};

function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 0x5F /* _ */
}

// UnicodePropertyValue ::
//   UnicodePropertyValueCharacters
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== ""
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
}

// LoneUnicodePropertyNameOrValue ::
//   UnicodePropertyValueCharacters
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state)
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(0x5B /* [ */)) {
    var negate = state.eat(0x5E /* ^ */);
    var result = this.regexp_classContents(state);
    if (!state.eat(0x5D /* ] */))
      { state.raise("Unterminated character class"); }
    if (negate && result === CharSetString)
      { state.raise("Negated character class may contain strings"); }
    return true
  }
  return false
};

// https://tc39.es/ecma262/#prod-ClassContents
// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
pp$1.regexp_classContents = function(state) {
  if (state.current() === 0x5D /* ] */) { return CharSetOk }
  if (state.switchV) { return this.regexp_classSetExpression(state) }
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
// https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
pp$1.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(0x2D /* - */) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
// https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;

  if (state.eat(0x5C /* \ */)) {
    if (this.regexp_eatClassEscape(state)) {
      return true
    }
    if (state.switchU) {
      // Make the same message as V8.
      var ch$1 = state.current();
      if (ch$1 === 0x63 /* c */ || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }

  var ch = state.current();
  if (ch !== 0x5D /* ] */) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }

  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;

  if (state.eat(0x62 /* b */)) {
    state.lastIntValue = 0x08; /* <BS> */
    return true
  }

  if (state.switchU && state.eat(0x2D /* - */)) {
    state.lastIntValue = 0x2D; /* - */
    return true
  }

  if (!state.switchU && state.eat(0x63 /* c */)) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true
    }
    state.pos = start;
  }

  return (
    this.regexp_eatCharacterClassEscape(state) ||
    this.regexp_eatCharacterEscape(state)
  )
};

// https://tc39.es/ecma262/#prod-ClassSetExpression
// https://tc39.es/ecma262/#prod-ClassUnion
// https://tc39.es/ecma262/#prod-ClassIntersection
// https://tc39.es/ecma262/#prod-ClassSubtraction
pp$1.regexp_classSetExpression = function(state) {
  var result = CharSetOk, subResult;
  if (this.regexp_eatClassSetRange(state)) ; else if (subResult = this.regexp_eatClassSetOperand(state)) {
    if (subResult === CharSetString) { result = CharSetString; }
    // https://tc39.es/ecma262/#prod-ClassIntersection
    var start = state.pos;
    while (state.eatChars([0x26, 0x26] /* && */)) {
      if (
        state.current() !== 0x26 /* & */ &&
        (subResult = this.regexp_eatClassSetOperand(state))
      ) {
        if (subResult !== CharSetString) { result = CharSetOk; }
        continue
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) { return result }
    // https://tc39.es/ecma262/#prod-ClassSubtraction
    while (state.eatChars([0x2D, 0x2D] /* -- */)) {
      if (this.regexp_eatClassSetOperand(state)) { continue }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) { return result }
  } else {
    state.raise("Invalid character in character class");
  }
  // https://tc39.es/ecma262/#prod-ClassUnion
  for (;;) {
    if (this.regexp_eatClassSetRange(state)) { continue }
    subResult = this.regexp_eatClassSetOperand(state);
    if (!subResult) { return result }
    if (subResult === CharSetString) { result = CharSetString; }
  }
};

// https://tc39.es/ecma262/#prod-ClassSetRange
pp$1.regexp_eatClassSetRange = function(state) {
  var start = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(0x2D /* - */) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
      return true
    }
    state.pos = start;
  }
  return false
};

// https://tc39.es/ecma262/#prod-ClassSetOperand
pp$1.regexp_eatClassSetOperand = function(state) {
  if (this.regexp_eatClassSetCharacter(state)) { return CharSetOk }
  return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state)
};

// https://tc39.es/ecma262/#prod-NestedClass
pp$1.regexp_eatNestedClass = function(state) {
  var start = state.pos;
  if (state.eat(0x5B /* [ */)) {
    var negate = state.eat(0x5E /* ^ */);
    var result = this.regexp_classContents(state);
    if (state.eat(0x5D /* ] */)) {
      if (negate && result === CharSetString) {
        state.raise("Negated character class may contain strings");
      }
      return result
    }
    state.pos = start;
  }
  if (state.eat(0x5C /* \ */)) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) {
      return result$1
    }
    state.pos = start;
  }
  return null
};

// https://tc39.es/ecma262/#prod-ClassStringDisjunction
pp$1.regexp_eatClassStringDisjunction = function(state) {
  var start = state.pos;
  if (state.eatChars([0x5C, 0x71] /* \q */)) {
    if (state.eat(0x7B /* { */)) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(0x7D /* } */)) {
        return result
      }
    } else {
      // Make the same message as V8.
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return null
};

// https://tc39.es/ecma262/#prod-ClassStringDisjunctionContents
pp$1.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(0x7C /* | */)) {
    if (this.regexp_classString(state) === CharSetString) { result = CharSetString; }
  }
  return result
};

// https://tc39.es/ecma262/#prod-ClassString
// https://tc39.es/ecma262/#prod-NonEmptyClassString
pp$1.regexp_classString = function(state) {
  var count = 0;
  while (this.regexp_eatClassSetCharacter(state)) { count++; }
  return count === 1 ? CharSetOk : CharSetString
};

// https://tc39.es/ecma262/#prod-ClassSetCharacter
pp$1.regexp_eatClassSetCharacter = function(state) {
  var start = state.pos;
  if (state.eat(0x5C /* \ */)) {
    if (
      this.regexp_eatCharacterEscape(state) ||
      this.regexp_eatClassSetReservedPunctuator(state)
    ) {
      return true
    }
    if (state.eat(0x62 /* b */)) {
      state.lastIntValue = 0x08; /* <BS> */
      return true
    }
    state.pos = start;
    return false
  }
  var ch = state.current();
  if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) { return false }
  if (isClassSetSyntaxCharacter(ch)) { return false }
  state.advance();
  state.lastIntValue = ch;
  return true
};

// https://tc39.es/ecma262/#prod-ClassSetReservedDoublePunctuator
function isClassSetReservedDoublePunctuatorCharacter(ch) {
  return (
    ch === 0x21 /* ! */ ||
    ch >= 0x23 /* # */ && ch <= 0x26 /* & */ ||
    ch >= 0x2A /* * */ && ch <= 0x2C /* , */ ||
    ch === 0x2E /* . */ ||
    ch >= 0x3A /* : */ && ch <= 0x40 /* @ */ ||
    ch === 0x5E /* ^ */ ||
    ch === 0x60 /* ` */ ||
    ch === 0x7E /* ~ */
  )
}

// https://tc39.es/ecma262/#prod-ClassSetSyntaxCharacter
function isClassSetSyntaxCharacter(ch) {
  return (
    ch === 0x28 /* ( */ ||
    ch === 0x29 /* ) */ ||
    ch === 0x2D /* - */ ||
    ch === 0x2F /* / */ ||
    ch >= 0x5B /* [ */ && ch <= 0x5D /* ] */ ||
    ch >= 0x7B /* { */ && ch <= 0x7D /* } */
  )
}

// https://tc39.es/ecma262/#prod-ClassSetReservedPunctuator
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch = state.current();
  if (isClassSetReservedPunctuator(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true
  }
  return false
};

// https://tc39.es/ecma262/#prod-ClassSetReservedPunctuator
function isClassSetReservedPunctuator(ch) {
  return (
    ch === 0x21 /* ! */ ||
    ch === 0x23 /* # */ ||
    ch === 0x25 /* % */ ||
    ch === 0x26 /* & */ ||
    ch === 0x2C /* , */ ||
    ch === 0x2D /* - */ ||
    ch >= 0x3A /* : */ && ch <= 0x3E /* > */ ||
    ch === 0x40 /* @ */ ||
    ch === 0x60 /* ` */ ||
    ch === 0x7E /* ~ */
  )
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 0x5F /* _ */) {
    state.lastIntValue = ch % 0x20;
    state.advance();
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(0x78 /* x */)) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
    state.advance();
  }
  return state.pos !== start
};
function isDecimalDigit(ch) {
  return ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start
};
function isHexDigit(ch) {
  return (
    (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */) ||
    (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) ||
    (ch >= 0x61 /* a */ && ch <= 0x66 /* f */)
  )
}
function hexToInt(ch) {
  if (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) {
    return 10 + (ch - 0x41 /* A */)
  }
  if (ch >= 0x61 /* a */ && ch <= 0x66 /* f */) {
    return 10 + (ch - 0x61 /* a */)
  }
  return ch - 0x30 /* 0 */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
// Allows only 0-377(octal) i.e. 0-255(decimal).
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true
  }
  return false
};

// https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
pp$1.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 0x30; /* 0 */
    state.advance();
    return true
  }
  state.lastIntValue = 0;
  return false
};
function isOctalDigit(ch) {
  return ch >= 0x30 /* 0 */ && ch <= 0x37 /* 7 */
}

// https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
// https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
// And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i = 0; i < length; ++i) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true
};

// Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.

var Token = function Token(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations)
    { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
  if (p.options.ranges)
    { this.range = [p.start, p.end]; }
};

// ## Tokenizer

var pp = Parser.prototype;

// Move to the next token

pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc)
    { this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword); }
  if (this.options.onToken)
    { this.options.onToken(new Token(this)); }

  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};

pp.getToken = function() {
  this.next();
  return new Token(this)
};

// If we're in an ES6 environment, make parsers iterable
if (typeof Symbol !== "undefined")
  { pp[Symbol.iterator] = function() {
    var this$1$1 = this;

    return {
      next: function () {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        }
      }
    }
  }; }

// Toggle strict mode. Re-reads the next number or string to please
// pedantic tests (`"use strict"; 010;` should fail).

// Read a single token, updating the parser object's token-related
// properties.

pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }

  this.start = this.pos;
  if (this.options.locations) { this.startLoc = this.curPosition(); }
  if (this.pos >= this.input.length) { return this.finishToken(types$1.eof) }

  if (curContext.override) { return curContext.override(this) }
  else { this.readToken(this.fullCharCodeAtPos()); }
};

pp.readToken = function(code) {
  // Identifier or keyword. '\uXXXX' sequences are allowed in
  // identifiers, so '\' also dispatches to that.
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
    { return this.readWord() }

  return this.getTokenFromCode(code)
};

pp.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 0xd7ff || code >= 0xdc00) { return code }
  var next = this.input.charCodeAt(this.pos + 1);
  return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00
};

pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = (void 0), pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment)
    { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                           startLoc, this.curPosition()); }
};

pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment)
    { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                           startLoc, this.curPosition()); }
};

// Called at the start of the parse and after every token. Skips
// whitespace and comments, and.

pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.pos);
    switch (ch) {
    case 32: case 160: // ' '
      ++this.pos;
      break
    case 13:
      if (this.input.charCodeAt(this.pos + 1) === 10) {
        ++this.pos;
      }
    case 10: case 8232: case 8233:
      ++this.pos;
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      break
    case 47: // '/'
      switch (this.input.charCodeAt(this.pos + 1)) {
      case 42: // '*'
        this.skipBlockComment();
        break
      case 47:
        this.skipLineComment(2);
        break
      default:
        break loop
      }
      break
    default:
      if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
        ++this.pos;
      } else {
        break loop
      }
    }
  }
};

// Called at the end of every token. Sets `end`, `val`, and
// maintains `context` and `exprAllowed`, and skips the space after
// the token, so that the next one's `start` will point at the
// right position.

pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) { this.endLoc = this.curPosition(); }
  var prevType = this.type;
  this.type = type;
  this.value = val;

  this.updateContext(prevType);
};

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) { return this.readNumber(true) }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
    this.pos += 3;
    return this.finishToken(types$1.ellipsis)
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot)
  }
};

pp.readToken_slash = function() { // '/'
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(types$1.slash, 1)
};

pp.readToken_mult_modulo_exp = function(code) { // '%*'
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types$1.star : types$1.modulo;

  // exponentiation operator ** and **=
  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }

  if (next === 61) { return this.finishOp(types$1.assign, size + 1) }
  return this.finishOp(tokentype, size)
};

pp.readToken_pipe_amp = function(code) { // '|&'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) { return this.finishOp(types$1.assign, 3) }
    }
    return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2)
  }
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1)
};

pp.readToken_caret = function() { // '^'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(types$1.bitwiseXOR, 1)
};

pp.readToken_plus_min = function(code) { // '+-'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
        (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      // A `-->` line comment
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken()
    }
    return this.finishOp(types$1.incDec, 2)
  }
  if (next === 61) { return this.finishOp(types$1.assign, 2) }
  return this.finishOp(types$1.plusMin, 1)
};

pp.readToken_lt_gt = function(code) { // '<>'
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types$1.assign, size + 1) }
    return this.finishOp(types$1.bitShift, size)
  }
  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
      this.input.charCodeAt(this.pos + 3) === 45) {
    // `<!--`, an XML-style comment that should be interpreted as a line comment
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken()
  }
  if (next === 61) { size = 2; }
  return this.finishOp(types$1.relational, size)
};

pp.readToken_eq_excl = function(code) { // '=!'
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) { return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
    this.pos += 2;
    return this.finishToken(types$1.arrow)
  }
  return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1)
};

pp.readToken_question = function() { // '?'
  var ecmaVersion = this.options.ecmaVersion;
  if (ecmaVersion >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) { return this.finishOp(types$1.questionDot, 2) }
    }
    if (next === 63) {
      if (ecmaVersion >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) { return this.finishOp(types$1.assign, 3) }
      }
      return this.finishOp(types$1.coalesce, 2)
    }
  }
  return this.finishOp(types$1.question, 1)
};

pp.readToken_numberSign = function() { // '#'
  var ecmaVersion = this.options.ecmaVersion;
  var code = 35; // '#'
  if (ecmaVersion >= 13) {
    ++this.pos;
    code = this.fullCharCodeAtPos();
    if (isIdentifierStart(code, true) || code === 92 /* '\' */) {
      return this.finishToken(types$1.privateId, this.readWord1())
    }
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp.getTokenFromCode = function(code) {
  switch (code) {
  // The interpretation of a dot depends on whether it is followed
  // by a digit or another two dots.
  case 46: // '.'
    return this.readToken_dot()

  // Punctuation tokens.
  case 40: ++this.pos; return this.finishToken(types$1.parenL)
  case 41: ++this.pos; return this.finishToken(types$1.parenR)
  case 59: ++this.pos; return this.finishToken(types$1.semi)
  case 44: ++this.pos; return this.finishToken(types$1.comma)
  case 91: ++this.pos; return this.finishToken(types$1.bracketL)
  case 93: ++this.pos; return this.finishToken(types$1.bracketR)
  case 123: ++this.pos; return this.finishToken(types$1.braceL)
  case 125: ++this.pos; return this.finishToken(types$1.braceR)
  case 58: ++this.pos; return this.finishToken(types$1.colon)

  case 96: // '`'
    if (this.options.ecmaVersion < 6) { break }
    ++this.pos;
    return this.finishToken(types$1.backQuote)

  case 48: // '0'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 120 || next === 88) { return this.readRadixNumber(16) } // '0x', '0X' - hex number
    if (this.options.ecmaVersion >= 6) {
      if (next === 111 || next === 79) { return this.readRadixNumber(8) } // '0o', '0O' - octal number
      if (next === 98 || next === 66) { return this.readRadixNumber(2) } // '0b', '0B' - binary number
    }

  // Anything else beginning with a digit is an integer, octal
  // number, or float.
  case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
    return this.readNumber(false)

  // Quotes produce strings.
  case 34: case 39: // '"', "'"
    return this.readString(code)

  // Operators are parsed inline in tiny state machines. '=' (61) is
  // often referred to. `finishOp` simply skips the amount of
  // characters it is given as second argument, and returns a token
  // of the type given by its first argument.
  case 47: // '/'
    return this.readToken_slash()

  case 37: case 42: // '%*'
    return this.readToken_mult_modulo_exp(code)

  case 124: case 38: // '|&'
    return this.readToken_pipe_amp(code)

  case 94: // '^'
    return this.readToken_caret()

  case 43: case 45: // '+-'
    return this.readToken_plus_min(code)

  case 60: case 62: // '<>'
    return this.readToken_lt_gt(code)

  case 61: case 33: // '=!'
    return this.readToken_eq_excl(code)

  case 63: // '?'
    return this.readToken_question()

  case 126: // '~'
    return this.finishOp(types$1.prefix, 1)

  case 35: // '#'
    return this.readToken_numberSign()
  }

  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
};

pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str)
};

pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (;;) {
    if (this.pos >= this.input.length) { this.raise(start, "Unterminated regular expression"); }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) { this.raise(start, "Unterminated regular expression"); }
    if (!escaped) {
      if (ch === "[") { inClass = true; }
      else if (ch === "]" && inClass) { inClass = false; }
      else if (ch === "/" && !inClass) { break }
      escaped = ch === "\\";
    } else { escaped = false; }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) { this.unexpected(flagsStart); }

  // Validate pattern
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);

  // Create Literal#value property value.
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
    // ESTree requires null if it failed to instantiate RegExp object.
    // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
  }

  return this.finishToken(types$1.regexp, {pattern: pattern, flags: flags, value: value})
};

// Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.

pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  // `len` is used for character escape sequences. In that case, disallow separators.
  var allowSeparators = this.options.ecmaVersion >= 12 && len === undefined;

  // `maybeLegacyOctalNumericLiteral` is true if it doesn't have prefix (0x,0o,0b)
  // and isn't fraction part nor exponent part. In that case, if the first digit
  // is zero then disallow separators.
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;

  var start = this.pos, total = 0, lastCode = 0;
  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = (void 0);

    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"); }
      if (lastCode === 95) { this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"); }
      if (i === 0) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"); }
      lastCode = code;
      continue
    }

    if (code >= 97) { val = code - 97 + 10; } // a
    else if (code >= 65) { val = code - 65 + 10; } // A
    else if (code >= 48 && code <= 57) { val = code - 48; } // 0-9
    else { val = Infinity; }
    if (val >= radix) { break }
    lastCode = code;
    total = total * radix + val;
  }

  if (allowSeparators && lastCode === 95) { this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"); }
  if (this.pos === start || len != null && this.pos - start !== len) { return null }

  return total
};

function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8)
  }

  // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
  return parseFloat(str.replace(/_/g, ""))
}

function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null
  }

  // `BigInt(value)` throws syntax error if the string contains numeric separators.
  return BigInt(str.replace(/_/g, ""))
}

pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2; // 0x
  var val = this.readInt(radix);
  if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
  return this.finishToken(types$1.num, val)
};

// Read an integer, octal integer, or floating-point number.

pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, undefined, true) === null) { this.raise(start, "Invalid number"); }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) { this.raise(start, "Invalid number"); }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types$1.num, val$1)
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
  if (next === 46 && !octal) { // '.'
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) { // 'eE'
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) { ++this.pos; } // '+-'
    if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }

  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val)
};

// Read a string value, interpreting backslash-escapes.

pp.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;

  if (ch === 123) { // '{'
    if (this.options.ecmaVersion < 6) { this.unexpected(); }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
  } else {
    code = this.readHexChar(4);
  }
  return code
};

pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (;;) {
    if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated string constant"); }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) { break }
    if (ch === 92) { // '\'
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch === 0x2028 || ch === 0x2029) {
      if (this.options.ecmaVersion < 10) { this.raise(this.start, "Unterminated string constant"); }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch)) { this.raise(this.start, "Unterminated string constant"); }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out)
};

// Reads template string tokens.

var INVALID_TEMPLATE_ESCAPE_ERROR = {};

pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err
    }
  }

  this.inTemplateElement = false;
};

pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR
  } else {
    this.raise(position, message);
  }
};

pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (;;) {
    if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated template"); }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) { // '`', '${'
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL)
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote)
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out)
    }
    if (ch === 92) { // '\'
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
      case 13:
        if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; }
      case 10:
        out += "\n";
        break
      default:
        out += String.fromCharCode(ch);
        break
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};

// Reads a template token to search for the end, without validating any escape sequences
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
    case "\\":
      ++this.pos;
      break

    case "$":
      if (this.input[this.pos + 1] !== "{") {
        break
      }

    // falls through
    case "`":
      return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos))

    // no default
    }
  }
  this.raise(this.start, "Unterminated template");
};

// Used to read escaped characters

pp.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
  case 110: return "\n" // 'n' -> '\n'
  case 114: return "\r" // 'r' -> '\r'
  case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
  case 117: return codePointToString(this.readCodePoint()) // 'u'
  case 116: return "\t" // 't' -> '\t'
  case 98: return "\b" // 'b' -> '\b'
  case 118: return "\u000b" // 'v' -> '\u000b'
  case 102: return "\f" // 'f' -> '\f'
  case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } // '\r\n'
  case 10: // ' \n'
    if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
    return ""
  case 56:
  case 57:
    if (this.strict) {
      this.invalidStringToken(
        this.pos - 1,
        "Invalid escape sequence"
      );
    }
    if (inTemplate) {
      var codePos = this.pos - 1;

      this.invalidStringToken(
        codePos,
        "Invalid escape sequence in template string"
      );
    }
  default:
    if (ch >= 48 && ch <= 55) {
      var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
      var octal = parseInt(octalStr, 8);
      if (octal > 255) {
        octalStr = octalStr.slice(0, -1);
        octal = parseInt(octalStr, 8);
      }
      this.pos += octalStr.length - 1;
      ch = this.input.charCodeAt(this.pos);
      if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
        this.invalidStringToken(
          this.pos - 1 - octalStr.length,
          inTemplate
            ? "Octal literal in template string"
            : "Octal literal in strict mode"
        );
      }
      return String.fromCharCode(octal)
    }
    if (isNewLine(ch)) {
      // Unicode new line characters after \ get removed from output in both
      // template literals and strings
      return ""
    }
    return String.fromCharCode(ch)
  }
};

// Used to read character escape sequences ('\x', '\u', '\U').

pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
  return n
};

// Read an identifier, and return it as a string. Sets `this.containsEsc`
// to whether the word contained a '\u' escape.
//
// Incrementally adds only escaped chars, adding other chunks as-is
// as a micro-optimization.

pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 0xffff ? 1 : 2;
    } else if (ch === 92) { // "\"
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) // "u"
        { this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"); }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
        { this.invalidStringToken(escStart, "Invalid Unicode escape"); }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos)
};

// Read an identifier or keyword token. Will check for reserved
// words when necessary.

pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word)
};

// Acorn is a tiny, fast JavaScript parser written in JavaScript.
//
// Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
// various contributors and released under an MIT license.
//
// Git repositories for Acorn are available at
//
//     http://marijnhaverbeke.nl/git/acorn
//     https://github.com/acornjs/acorn.git
//
// Please use the [github bug tracker][ghbt] to report issues.
//
// [ghbt]: https://github.com/acornjs/acorn/issues
//
// [walk]: util/walk.js


var version = "8.11.3";

Parser.acorn = {
  Parser: Parser,
  version: version,
  defaultOptions: defaultOptions,
  Position: Position,
  SourceLocation: SourceLocation,
  getLineInfo: getLineInfo,
  Node: Node,
  TokenType: TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext: TokContext,
  tokContexts: types,
  isIdentifierChar: isIdentifierChar,
  isIdentifierStart: isIdentifierStart,
  Token: Token,
  isNewLine: isNewLine,
  lineBreak: lineBreak,
  lineBreakG: lineBreakG,
  nonASCIIwhitespace: nonASCIIwhitespace
};

// The main exported interface (under `self.acorn` when in the
// browser) is a `parse` function that takes a code string and returns
// an abstract syntax tree as specified by the [ESTree spec][estree].
//
// [estree]: https://github.com/estree/estree

function parse(input, options) {
  return Parser.parse(input, options)
}

// This function tries to parse a single expression at a given
// offset in a string. Useful for parsing mixed-language formats
// that embed JavaScript expressions.

function parseExpressionAt(input, pos, options) {
  return Parser.parseExpressionAt(input, pos, options)
}

// Acorn is organized as a tokenizer and a recursive-descent parser.
// The `tokenizer` export provides an interface to the tokenizer.

function tokenizer(input, options) {
  return Parser.tokenizer(input, options)
}



return { Node, Parser, Position, SourceLocation, TokContext, Token, TokenType, defaultOptions, getLineInfo, isIdentifierChar, isIdentifierStart, isNewLine, keywordTypes: keywords, lineBreak, lineBreakG, nonASCIIwhitespace, parse, parseExpressionAt, tokContexts: types, tokTypes: types$1, tokenizer, version };
})();

// ---- tools/sdk_rules.mjs ----
const M_rules = (() => {
// The lamba.json rules (docs/sdk/MANIFEST.md), in one place, with no reach into the disk: plain JavaScript that runs in node
// (tools/sdk_manifest.mjs, tools/lamba_check.mjs) and in the worker (worker/studio.js checks every uploaded app with the
// same rules, worker/check.js).
//   import { checkRules } from "./sdk_rules.mjs";
//   checkRules(manifest, { has: path => true | false, folder: "countdown" })   // problems: [] when it is right
// dir: what is in the app's folder (has), and the folder's name (folder: left out when the name does not matter, as in an
// uploaded zip). Without dir only the manifest itself is checked.
const MANIFEST_VERSION = 1;
const ID = /^[a-z][a-z0-9-]{1,23}$/;
const KEY = /^[a-z][A-Za-z0-9]{0,23}$/;                  // a setting's key (kept in the saved settings)
const GROUP = /^[a-z][a-z0-9-]{0,23}$/;                   // a group's or a part's key (in the address: &g=&p=)
const CHOICE = /^[A-Za-z0-9_-]{0,40}$/;                   // a choice's id when it is text ("" allowed: "none")
const HEX = /^#[0-9a-f]{6}$/i;
const AVOID = new RegExp("\\b" + ["r", "a", "i", "n", "b", "o", "w"].join("") + "\\b", "i");   // the one word Lamba never uses (spelled out nowhere)
const DASH = /[\u2013\u2014]/;                            // en and em dashes: never in words people read
// an app's name as the portal sets it (lamba.tv/devs, Rename): the same rules as lamba.json name, in plain words. "" when it is fine
const NAME_MAX = 24;
const nameProblem = v => typeof v !== "string" || !v.trim() ? "Give it a name."
  : v.trim().length > NAME_MAX ? NAME_MAX + " characters at most."
  : /[\u0000-\u001f\u007f<>]/.test(v) ? "Use letters, digits and plain punctuation."
  : DASH.test(v) ? "No en or em dash: use a comma or rewrite it."
  : /(?![\u00a9\u00ae\u2122\u2194-\u2199\u21a9\u21aa])\p{Extended_Pictographic}|\u{FE0F}/u.test(v) ? "No emoji: words only."
  : AVOID.test(v) ? "That word isn't used on Lamba." : "";
// what the host keeps for itself in every app's settings (the frame round the app, and its brightness)
const HOST_KEYS = ["frame", "frc", "fw", "mw", "matc", "fday", "fown", "fall", "bright", "pc"];   // pc: the Host lets Players change the settings of the groups marked "players": true
const TYPES = ["choice", "switch", "number", "text", "list", "colour", "colours", "strokes", "transforms", "photo"];
const PERMISSIONS = ["sound", "camera", "motion", "country", "microphone", "video"];   // camera: the picture never leaves the phone; video: a live picture shown on the screen (Lamba.video.live)
const AGES = ["all", "7+", "13+"];
// the app's shelf on the phone and the showcase (optional for now; the listing on /devs asks for it)
const CATEGORIES = ["games", "party", "kids", "learning", "art", "music", "clocks", "calm", "photos", "sports", "tools"];
// the tabs of the phone's app list, where an app may name its own shelves ("categories": 1 to 3 of these). The same ids,
// names and icons as shell/categories.js SHELF_IDS (tests/app-categories.test.mjs keeps the two the same); left out,
// the shelves come from "category" and "guests" (shell/categories.js of)
const SHELVES = ["games", "kids", "friends", "ambient", "create", "clocks", "art", "music", "tools"];
// the built-in controls an app may offer Players (lamba.json "forPlayers"): Lamba's own tiles, the screen's sound (volume and
// mute, live), its brightness, its frame and mat, its Effects (cracks, lines, colour, signal, flies: never a scare) and its
// Schedule (VIEW ONLY: a Player sees when the Screen turns on and off, and never changes it). The Host switches each one on or
// off for Players (design.pc). Music is Lamba's music (needs "music": true)
const FOR_PLAYERS = ["sound", "brightness", "frame", "effects", "schedule", "music"];
const HOST_PARTS = ["frame", "mat", "brightness"];
// the drawer's tiles the host draws itself, so no group of the app may take their key (or their address, &g=): its frame,
// mat and brightness, "Try as a player" (guest), "Scribble", "Effects", "Schedule", "Who's waiting" (line), the visitors' settings and
// "Players" (playerctl: the Host's switch for letting Players change the groups marked "players": true)
const HOST_GROUPS = ["frame", "mat", "bright", "guest", "scribble", "effects", "schedule", "line", "visitors", "playerctl"];
const ASPECT = /^([1-9]\d?):([1-9]\d?)$/;
const PICTURE_FILE = /^[a-z0-9][a-z0-9_./-]{0,80}\.(svg|png|webp|jpg|jpeg)$/i;

// a path inside the app's folder: relative, no "..", no leading slash, no address
const inside = p => typeof p === "string" && p.length > 0 && p.length < 120 && !/^[a-z]+:/i.test(p) && !p.startsWith("/") && !p.split(/[\\/]/).includes("..") && !p.includes("\\");

// Every rule, with a plain sentence for each problem found
function checkRules(m, dir) {
  const P = [], say = s => P.push(s);
  const str = (v, max, what, opt) => { if (v === undefined && opt) return; if (typeof v !== "string" || !v.trim()) say(what + " must be text"); else { if (v.length > max) say(what + " is longer than " + max + " characters"); if (DASH.test(v)) say(what + " has an en or em dash (use a comma, a full stop or rewrite it)"); if (AVOID.test(v)) say(what + " uses a word Lamba never uses (design rules: Words)"); } };
  const file = (p, what, opt) => { if (p === undefined && opt) return; if (!inside(p)) { say(what + " must be a file inside the app's folder"); return; } if (dir && !dir.has(p)) say(what + " (" + p + ") is missing"); };
  if (!m || typeof m !== "object" || Array.isArray(m)) return ["lamba.json must be one object"];
  if (m.lamba !== MANIFEST_VERSION) say("lamba must be " + MANIFEST_VERSION + " (the version of these rules)");
  if (typeof m.id !== "string" || !ID.test(m.id)) say("id must be 2 to 24 small letters, digits or dashes, starting with a letter");
  else if (dir && dir.folder && dir.folder !== m.id) say("id (" + m.id + ") must be the name of the app's folder");
  str(m.name, 24, "name"); str(m.sub, 40, "sub"); str(m.about, 80, "about");
  // what's new in this version, for an update: plain words players read on the app's page ("New: ...") and the reviewer reads
  if (m.whatsNew !== undefined) { str(m.whatsNew, 300, "whatsNew"); if (typeof m.whatsNew === "string" && /[<>]/.test(m.whatsNew)) say("whatsNew must be plain words, no HTML"); }
  file(m.icon, "icon");
  if (m.icon && !/\.svg$/i.test(m.icon)) say("icon must be an SVG file");
  file(m.card, "card", true);
  if (m.tint !== undefined && !((typeof m.tint === "string" && HEX.test(m.tint)) || (Array.isArray(m.tint) && m.tint.length === 2 && m.tint.every(c => typeof c === "string" && HEX.test(c))))) say("tint must be a colour (#rrggbb) or two of them");
  // the moving clips on the app's page: [file, caption], clips/<file>.mp4 and clips/<file>-poster.webp
  if (m.clips === undefined && m.stagingOnly === true) { /* an app still on staging: clips come before it is published */ }
  else if (!Array.isArray(m.clips) || m.clips.length < 2) say("clips: at least 2 [file, caption] (design rules: Clips, node lamba-clips.mjs)");
  else m.clips.forEach((c, i) => {
    if (!Array.isArray(c) || c.length !== 2 || typeof c[0] !== "string" || !/^[a-z0-9-]{1,60}$/.test(c[0]) || typeof c[1] !== "string") { say("clips[" + i + "] must be [\"file-name\", \"caption\"]"); return; }
    str(c[1], 60, "clips[" + i + "] caption");
    if (dir) for (const f of ["clips/" + c[0] + ".mp4", "clips/" + c[0] + "-poster.webp"]) if (!dir.has(f)) say("clip file " + f + " is missing");
  });
  // the app's page on the start page: facts and a longer description
  const page = m.page || {};
  if (page.facts !== undefined) { if (!Array.isArray(page.facts) || page.facts.length > 6) say("page.facts: at most 6 [label, value, small]"); else page.facts.forEach((f, i) => { if (!Array.isArray(f) || f.length < 2 || f.length > 3) say("page.facts[" + i + "] must be [label, value, small]"); else f.forEach((t, j) => str(t, 60, "page.facts[" + i + "][" + j + "]")); }); }
  if (page.about !== undefined) { if (!Array.isArray(page.about) || page.about.length > 8) say("page.about: at most 8 sections"); else page.about.forEach((s, i) => {
    if (!s || typeof s !== "object") { say("page.about[" + i + "] must be { h, p } or { h, items }"); return; }
    str(s.h, 60, "page.about[" + i + "].h"); str(s.p, 600, "page.about[" + i + "].p", true);
    if (s.items !== undefined) { if (!Array.isArray(s.items)) say("page.about[" + i + "].items must be a list"); else s.items.forEach((it, j) => { if (!Array.isArray(it) || it.length !== 2) say("page.about[" + i + "].items[" + j + "] must be [bold, rest]"); else { str(it[0], 40, "page.about item"); str(it[1], 300, "page.about item"); } }); }
    if (s.p === undefined && s.items === undefined) say("page.about[" + i + "] needs p or items");
  }); }
  // the pages
  const sc = m.screens || {};
  file(sc.tv, "screens.tv"); file(sc.phone, "screens.phone", true); file(sc.picture, "screens.picture", true);
  for (const k of Object.keys(sc)) if (!["tv", "phone", "picture"].includes(k)) say("screens." + k + " is not a screen (tv, phone, picture)");
  for (const k of ["tv", "phone", "picture"]) if (sc[k] && !/\.html$/.test(sc[k])) say("screens." + k + " must be an .html page");
  // people
  const pl = m.players === undefined ? { min: 0, max: 0 } : m.players && typeof m.players === "object" ? m.players : {};
  if (!Number.isInteger(pl.min) || !Number.isInteger(pl.max) || pl.min < 0 || pl.max > 50 || pl.min > pl.max) say("players must be { min, max }, whole numbers, 0 to 50, min at most max");
  if (typeof m.guests !== "boolean") say("guests must be true or false");
  if (m.askName !== undefined) { if (typeof m.askName !== "boolean") say("askName must be true or false"); else if (m.askName && m.guests !== true) say("askName asks a Player their name when they join: it needs guests true"); }
  // visitors: more people than the seats, who send a little and never wait (worker/sdk.js sdkVisMax, sdkVisRate)
  const vi = m.visitors;
  if (vi !== undefined) {
    if (!vi || typeof vi !== "object" || Array.isArray(vi) || !Number.isInteger(vi.max) || vi.max < 1 || vi.max > 200) say("visitors must be { max, perMinute }: max a whole number, 1 to 200");
    else if (vi.perMinute !== undefined && !(Number.isInteger(vi.perMinute) && vi.perMinute >= 1 && vi.perMinute <= 60)) say("visitors.perMinute must be a whole number, 1 to 60 (messages a minute from each visitor)");
    if (vi && typeof vi === "object") for (const k of Object.keys(vi)) if (!["max", "perMinute"].includes(k)) say("visitors." + k + " is not a visitors field (max, perMinute)");
    if (m.guests !== true) say("visitors join from their phones: they need guests true");
  }
  if (m.guests && !(pl.max > 0) && vi === undefined) say("an app Players join needs players.max of 1 or more (or visitors)");
  if (m.guests && !sc.phone) say("an app Players join needs screens.phone (the Players' page)");
  if (!AGES.includes(m.age)) say("age must be one of " + AGES.join(", "));
  if (m.category !== undefined && !CATEGORIES.includes(m.category)) say("category must be one of " + CATEGORIES.join(", "));
  if (m.categories !== undefined && !(Array.isArray(m.categories) && m.categories.length >= 1 && m.categories.length <= 3 && m.categories.every(c => SHELVES.includes(c)) && new Set(m.categories).size === m.categories.length))
    say("categories must be 1 to 3 of " + SHELVES.join(", ") + ", each once");
  if (Array.isArray(m.categories) && m.categories.includes("kids") && m.age === "13+") say("an app on the kids shelf is for children: age \"all\" or \"7+\"");
  if (Array.isArray(m.categories) && m.categories.includes("kids") && Array.isArray(m.outside) && m.outside.length) say("an app on the kids shelf reaches nothing outside Lamba: outside must be empty");
  // made for kids: for children's ages, and nothing reached outside Lamba
  if (m.category === "kids" && m.age === "13+") say("a kids app is for children: age \"all\" or \"7+\"");
  if (m.category === "kids" && Array.isArray(m.outside) && m.outside.length) say("a kids app reaches nothing outside Lamba: outside must be empty");
  if (!Array.isArray(m.permissions) || m.permissions.some(p => !PERMISSIONS.includes(p))) say("permissions must be a list of " + PERMISSIONS.join(", "));
  if (!Array.isArray(m.outside)) say("outside must be a list of https addresses (empty for none)");
  else m.outside.forEach(o => { if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(:\d+)?$/i.test(o || "")) say("outside: " + o + " must be https://host (no path)"); });
  if (m.split !== undefined && m.split !== "tall" && m.split !== "letterbox") say("split must be \"tall\" (the screen page gets a half's own tall shape in a split screen and reads Lamba.layout) or \"letterbox\" (the default: the whole 16:9 page scaled into the half)");
  if (m.frame !== undefined && m.frame !== "none") say("frame must be \"none\" (the app starts without a frame; the Host can still pick one)");
  for (const k of ["stagingOnly", "notInDemo", "listed", "liveCard", "music"]) if (m[k] !== undefined && typeof m[k] !== "boolean") say(k + " must be true or false");
  if (m.position !== undefined && !(m.position && typeof m.position.after === "string" && ID.test(m.position.after))) say("position must be { after: <an app id> }");
  if (m.remote !== undefined && !(m.remote && typeof m.remote.ok === "boolean")) say("remote must be { ok: true | false }");
  // actions: one tap tiles in the Host's drawer (Feed, Tend the fire, New game); a tap sends { type: "action", key } to the screen
  checkActions(m, dir, say, str, file);
  if (m.legacy !== undefined) {
    const L = m.legacy;
    if (!L || typeof L !== "object" || (L.tvStorage !== undefined && !/^lf-[a-z0-9-]{1,30}$/.test(L.tvStorage)) || (L.store !== undefined && (!Array.isArray(L.store) || L.store.some(k => typeof k !== "string" || !KEY.test(k)))) || (L.tvStorageExtra !== undefined && (!L.tvStorageExtra || typeof L.tvStorageExtra !== "object")))
      say("legacy must be { tvStorage: \"lf-<name>\", store: [keys], tvStorageExtra: { storeKey: \"lf-<name>\" } }");
  }
  // inside: the small picture of the app inside the frames on the phone (a file, or one per choice of a setting)
  if (m.inside !== undefined) {
    if (typeof m.inside === "string") file(m.inside, "inside");
    else if (m.inside && m.inside.by && m.inside.pictures && typeof m.inside.pictures === "object") Object.keys(m.inside.pictures).forEach(k => file(m.inside.pictures[k], "inside.pictures." + k));
    else say("inside must be a picture file or { by: <setting>, pictures: { choice: file } }");
  }
  checkSettings(m, dir, say, str, file);
  checkMoney(m, say, str);
  return P;
}

// ---- Money (docs/sdk/MONETIZE.md): a paid app, a subscription and in-app unlocks. Building stays free; Lamba sells for the
// developer with its own payment sheet on the Host's phone and keeps FEE_BPS (15%, an admin may change it per app). Prices are
// whole US cents from Lamba's tiers only, so every price reads the same everywhere ("$2.99", "$1.99/month"). The Host buys
// for their household: every screen and co-Host of the account uses what it bought. Players never buy, and never in a kids app.
//   "price": 299                                              buy the app once
//   "subscription": { "monthly": 199, "yearly": 1999, "trialDays": 7 }   or subscribe (one or both plans; a free trial is optional)
//   "products": [{ "id": "winter", "name": "Winter looks", "price": 99, "description": "Four snowy scenes", "trialDays": 3 }]   unlocks, bought once (an optional free try)
//   "preview": { "mode": "free" | "time" | "locked", "minutes": 10 }      what a paid app does before it is bought
const PRICE_TIERS = {
  once: [99, 199, 299, 399, 499, 699, 999, 1499, 1999, 2999, 4999],
  monthly: [99, 199, 299, 399, 499, 699, 999, 1499],
  yearly: [999, 1499, 1999, 2999, 3999, 4999, 6999, 9999],
  unlock: [99, 199, 299, 399, 499, 699, 999, 1499, 1999]
};
const TRIAL_MAX = 90, PRODUCT_TRIAL_MAX = 30;   // a free trial: any whole number of days up to these (an admin may cap or force it)
const PREVIEW_MODES = ["free", "time", "locked"];
const PRODUCTS_MAX = 20, FEE_BPS = 1500, GRACE_DAYS = 7;
// the hosts Lamba refuses in outside, and in any page: other ways to take money (Lamba sells for every app)
const PAY_HOSTS = /(^|\.)(stripe\.com|stripe\.network|paypal\.com|paypal\.me|paypalobjects\.com|braintreegateway\.com|braintree-api\.com|squareup\.com|square\.site|adyen\.com|checkout\.com|gumroad\.com|lemonsqueezy\.com|paddle\.com|paddle\.net|ko-fi\.com|patreon\.com|buymeacoffee\.com|razorpay\.com|2checkout\.com|chargebee\.com|recurly\.com|payoneer\.com|venmo\.com|cash\.app|revolut\.me|wise\.com|klarna\.com|afterpay\.com|coinbase\.com|opennode\.com)$/i;
const paidOf = m => !!m && (m.price !== undefined || m.subscription !== undefined || (Array.isArray(m.products) && m.products.length > 0));
const kidsOf = m => !!m && (m.category === "kids" || (Array.isArray(m.categories) && m.categories.includes("kids")));
// $2.99, $19.99, $0.99 (US dollars, from whole cents)
const money = c => "$" + (Math.floor(c / 100)) + "." + String(c % 100).padStart(2, "0");
// Lamba's share and the developer's, in whole cents: the fee rounds to the nearest cent, the developer gets the rest
const split = (cents, bps) => { const b = Number.isInteger(bps) && bps >= 0 && bps <= 10000 ? bps : FEE_BPS, fee = Math.round(cents * b / 10000); return { fee, dev: cents - fee, bps: b }; };
// the prices a version declares, in one shape (the server keeps the approved ones as an app's "pay"): null for a free app
function payOf(m) {
  if (!paidOf(m)) return null;
  const s = m.subscription || null, out = { price: Number.isInteger(m.price) ? m.price : 0, monthly: s && Number.isInteger(s.monthly) ? s.monthly : 0, yearly: s && Number.isInteger(s.yearly) ? s.yearly : 0,
    trialDays: s && Number.isInteger(s.trialDays) ? s.trialDays : 0, products: (Array.isArray(m.products) ? m.products : []).filter(p => p && typeof p.id === "string").map(p => Object.assign({ id: p.id, name: String(p.name || ""), price: p.price, description: String(p.description || "") }, Number.isInteger(p.trialDays) && p.trialDays > 0 ? { trialDays: p.trialDays } : {})),
    category: typeof m.category === "string" ? m.category : "",
    preview: m.preview && PREVIEW_MODES.includes(m.preview.mode) ? { mode: m.preview.mode, minutes: m.preview.mode === "time" ? m.preview.minutes : 0 } : { mode: "free", minutes: 0 }, kids: kidsOf(m) };
  return out;
}
// what the store shows beside the name: "Free", "$2.99", "$1.99/month", "Free trial 7 days" (the lowest way in)
function priceLabel(p) {
  if (!p || (!p.price && !p.monthly && !p.yearly)) return "Free";
  if ((p.monthly || p.yearly) && p.trialDays) return "Free trial " + p.trialDays + " days";
  if (p.monthly) return money(p.monthly) + "/month";
  if (p.yearly) return money(p.yearly) + "/year";
  return money(p.price);
}
function checkMoney(m, say, str) {
  const tier = (v, list, what) => { if (!Number.isInteger(v) || !list.includes(v)) say(what + " must be one of Lamba's price tiers, in US cents: " + list.join(", ")); };
  if (m.price !== undefined) tier(m.price, PRICE_TIERS.once, "price");
  const s = m.subscription;
  if (s !== undefined) {
    if (!s || typeof s !== "object" || Array.isArray(s)) say("subscription must be { monthly, yearly, trialDays }");
    else {
      for (const k of Object.keys(s)) if (!["monthly", "yearly", "trialDays"].includes(k)) say("subscription." + k + " is not a subscription field (monthly, yearly, trialDays)");
      if (s.monthly === undefined && s.yearly === undefined) say("subscription needs monthly, yearly or both");
      if (s.monthly !== undefined) tier(s.monthly, PRICE_TIERS.monthly, "subscription.monthly");
      if (s.yearly !== undefined) tier(s.yearly, PRICE_TIERS.yearly, "subscription.yearly");
      if (Number.isInteger(s.monthly) && Number.isInteger(s.yearly) && s.yearly >= s.monthly * 12) say("subscription.yearly must cost less than 12 months of monthly");
      if (s.trialDays !== undefined && !(Number.isInteger(s.trialDays) && s.trialDays >= 0 && s.trialDays <= TRIAL_MAX)) say("subscription.trialDays must be a whole number of days, 0 to " + TRIAL_MAX);
    }
    if (m.price !== undefined) say("an app is bought once (price) or subscribed to (subscription), not both");
  }
  if (m.products !== undefined) {
    if (!Array.isArray(m.products) || m.products.length > PRODUCTS_MAX) say("products: a list of at most " + PRODUCTS_MAX + " unlocks");
    else {
      const seen = new Set();
      m.products.forEach((p, i) => {
        const w = "products[" + i + "]";
        if (!p || typeof p !== "object" || Array.isArray(p)) { say(w + " must be { id, name, price, description }"); return; }
        for (const k of Object.keys(p)) if (!["id", "name", "price", "description", "kind", "trialDays"].includes(k)) say(w + "." + k + " is not a product field (id, name, price, description, trialDays)");
        if (p.trialDays !== undefined && !(Number.isInteger(p.trialDays) && p.trialDays >= 0 && p.trialDays <= PRODUCT_TRIAL_MAX)) say(w + ".trialDays must be a whole number of days, 0 to " + PRODUCT_TRIAL_MAX + " (a free try before buying)");
        if (typeof p.id !== "string" || !/^[a-z][a-z0-9-]{1,31}$/.test(p.id)) say(w + ".id must be 2 to 32 small letters, digits or dashes, starting with a letter");
        else if (p.id === "app" || seen.has(p.id)) say(w + ".id (" + p.id + ") is used twice or is \"app\" (Lamba's word for the app itself)"); else seen.add(p.id);
        str(p.name, 30, w + ".name"); str(p.description, 90, w + ".description");
        tier(p.price, PRICE_TIERS.unlock, w + ".price");
        // only unlocks for now: bought once, kept for good. Consumables (coins, lives) come later and are refused until then
        if (p.kind !== undefined && p.kind !== "unlock") say(w + ".kind: only \"unlock\" (bought once, kept for good); consumables are not offered yet");
      });
    }
  }
  const pv = m.preview;
  if (pv !== undefined) {
    if (!pv || typeof pv !== "object" || !PREVIEW_MODES.includes(pv.mode)) say("preview must be { mode: \"free\" | \"time\" | \"locked\", minutes }");
    else {
      if (pv.mode === "time" && !(Number.isInteger(pv.minutes) && pv.minutes >= 1 && pv.minutes <= 60)) say("preview.minutes must be a whole number, 1 to 60 (minutes a day before Lamba asks the Host to buy)");
      if (pv.mode !== "time" && pv.minutes !== undefined) say("preview.minutes is only for mode \"time\"");
      for (const k of Object.keys(pv)) if (!["mode", "minutes"].includes(k)) say("preview." + k + " is not a preview field (mode, minutes)");
    }
    if (m.price === undefined && m.subscription === undefined) say("preview is for an app that is bought or subscribed to (price or subscription)");
  } else if (m.price !== undefined || m.subscription !== undefined) say("a paid app says what it shows before it is bought: preview { mode: \"free\" | \"time\" | \"locked\" }");
  if (Array.isArray(m.outside)) m.outside.forEach(o => { const h = String(o || "").replace(/^https:\/\//i, "").replace(/:\d+$/, ""); if (PAY_HOSTS.test(h)) say("outside: " + o + " takes payments; Lamba sells for every app (price, subscription, products and Lamba.buy)"); });
}

const ACTIONS_MAX = 4;
function checkActions(m, dir, say, str, file) {
  const A = m.actions;
  if (A === undefined) return;
  if (!Array.isArray(A) || !A.length || A.length > ACTIONS_MAX) { say("actions must be a list of 1 to " + ACTIONS_MAX + " { key, label, icon }"); return; }
  const keys = new Set(), G = m.settings && Array.isArray(m.settings.groups) ? m.settings.groups : [], groups = new Set(G.map(g => g && g.key).filter(Boolean));
  A.forEach((a, i) => {
    const w = "actions[" + i + "]";
    if (!a || typeof a !== "object" || Array.isArray(a)) { say(w + " must be { key, label, icon }"); return; }
    if (typeof a.key !== "string" || !GROUP.test(a.key)) say(w + ".key must be small letters, digits or dashes");
    else { if (keys.has(a.key)) say(w + ".key " + a.key + " twice"); keys.add(a.key); if (HOST_GROUPS.includes(a.key) || groups.has(a.key)) say(w + ".key " + a.key + " is a group's key (an action's key is its own)"); }
    str(a.label, 24, w + ".label");
    if (typeof a.icon !== "string" || !/\.svg$/i.test(a.icon)) say(w + ".icon must be an SVG file (one colour: the host tints it like every tile's icon)"); else file(a.icon, w + ".icon");
    for (const k of Object.keys(a)) if (!["key", "label", "icon"].includes(k)) say(w + "." + k + " is not part of an action (key, label, icon)");
  });
}

function checkPicture(p, dir, say, what, file) {
  if (p === undefined || p === "live") return;
  if (typeof p === "string") { if (!PICTURE_FILE.test(p)) say(what + ": a picture is a file (svg, png, webp, jpg), \"live\", { icon }, { text }"); else file(p, what); return; }
  if (p && typeof p === "object") {
    if (p.icon !== undefined) { if (!/\.svg$/i.test(p.icon || "")) say(what + ".icon must be an SVG file"); else file(p.icon, what + ".icon"); return; }
    if (p.text !== undefined) { if (typeof p.text !== "string" || p.text.length > 24) say(what + ".text must be short text"); if (p.small !== undefined && (typeof p.small !== "string" || p.small.length > 24)) say(what + ".small must be short text"); return; }
    if (p.choice === true) return;
  }
  say(what + ": a picture is a file, \"live\", { icon: file.svg }, { text, small } or { choice: true }");
}

function checkSettings(m, dir, say, str, file) {
  const S = m.settings;
  if (S === undefined) return;
  if (!S || typeof S !== "object" || !S.fields || typeof S.fields !== "object" || !Array.isArray(S.groups)) { say("settings must be { fields: {...}, groups: [...] }"); return; }
  const keys = Object.keys(S.fields);
  if (keys.length > 40) say("settings: at most 40 fields");
  for (const k of keys) {
    const f = S.fields[k], w = "settings.fields." + k;
    if (!KEY.test(k)) say(w + ": a setting's key is a letter then letters or digits (at most 24)");
    if (HOST_KEYS.includes(k)) say(w + ": " + k + " belongs to the host (frame, mat and brightness are added by the host)");
    if (!f || typeof f !== "object" || !TYPES.includes(f.type)) { say(w + ".type must be one of " + TYPES.join(", ")); continue; }
    if (f.apply !== undefined && !["now", "send"].includes(f.apply)) say(w + ".apply must be \"now\" (at once) or \"send\" (with Send to screen)");
    if (f.resets !== undefined && (!Array.isArray(f.resets) || f.resets.some(r => !keys.includes(r)))) say(w + ".resets must list other settings");
    const choiceList = c => {
      if (!Array.isArray(c) || !c.length || c.length > 120) { say(w + ".choices must be a list of 1 to 120"); return []; }
      c.forEach((x, i) => {
        if (!x || typeof x !== "object" || !(typeof x.id === "number" || (typeof x.id === "string" && CHOICE.test(x.id)))) say(w + ".choices[" + i + "].id must be a number or short text");
        str(x && x.name, 40, w + ".choices[" + i + "].name"); str(x && x.sub, 90, w + ".choices[" + i + "].sub", true); str(x && x.short, 24, w + ".choices[" + i + "].short", true);
        checkPicture(x && x.picture, dir, say, w + ".choices[" + i + "].picture", file);
      });
      const ids = c.map(x => x && x.id); if (new Set(ids).size !== ids.length) say(w + ".choices: each id once");
      return ids;
    };
    if (f.type === "choice") {
      const ids = choiceList(f.choices);
      if (!ids.includes(f.default)) say(w + ".default must be one of its choices");
      if (f.dynamic !== undefined && typeof f.dynamic !== "boolean") say(w + ".dynamic must be true or false");
    } else if (f.type === "switch") {
      if (typeof f.default !== "boolean") say(w + ".default must be true or false");
      for (const s of ["on", "off"]) { const x = f[s]; if (!x || typeof x !== "object") { say(w + "." + s + " must be { name, sub, picture }"); continue; } str(x.name, 40, w + "." + s + ".name"); str(x.sub, 90, w + "." + s + ".sub", true); str(x.short, 24, w + "." + s + ".short", true); checkPicture(x.picture, dir, say, w + "." + s + ".picture", file); }
      if (f.first !== undefined && !["on", "off"].includes(f.first)) say(w + ".first must be \"on\" or \"off\" (which comes first in the strip)");
    } else if (f.type === "number") {
      if (![f.min, f.max, f.step, f.default].every(n => typeof n === "number" && isFinite(n)) || f.min >= f.max || f.step <= 0) say(w + " needs min < max, step > 0 and a default");
      else if (f.default < f.min || f.default > f.max) say(w + ".default must be between min and max");
      if (f.labels !== undefined && (!Array.isArray(f.labels) || f.labels.length !== Math.round((f.max - f.min) / f.step) + 1)) say(w + ".labels: one per step, from min to max");
      if (Array.isArray(f.labels)) f.labels.forEach((l, i) => str(l, 30, w + ".labels[" + i + "]"));
      if (f.unit !== undefined) str(f.unit, 12, w + ".unit");
    } else if (f.type === "text") {
      if (!Number.isInteger(f.max) || f.max < 1 || f.max > 200) say(w + ".max must be 1 to 200 characters");
      if (typeof f.default !== "string" || f.default.length > (f.max || 0)) say(w + ".default must be text no longer than max");
      if (f.multiline !== undefined && typeof f.multiline !== "boolean") say(w + ".multiline must be true or false (line breaks kept)");
    } else if (f.type === "list") {
      if (!Array.isArray(f.of) || !f.of.length || f.of.length > 200 || f.of.some(x => typeof x !== "string" || !CHOICE.test(x))) say(w + ".of must list the ids it may hold");
      if (!Number.isInteger(f.min) || !Number.isInteger(f.max) || f.min < 0 || f.min > f.max) say(w + " needs min and max (how many it holds)");
      if (!Array.isArray(f.default) || f.default.some(x => !(f.of || []).includes(x)) || f.default.length < (f.min || 0) || f.default.length > (f.max || 0)) say(w + ".default must be a list of its ids");
      if (f.presets !== undefined) {
        if (!Array.isArray(f.presets)) say(w + ".presets must be a list");
        else f.presets.forEach((x, i) => { if (!x || !CHOICE.test(x.id || "") || !Array.isArray(x.value) || x.value.some(v => !(f.of || []).includes(v))) say(w + ".presets[" + i + "] must be { id, name, value: [ids] }"); str(x && x.name, 40, w + ".presets[" + i + "].name"); str(x && x.sub, 90, w + ".presets[" + i + "].sub", true); checkPicture(x && x.picture, dir, say, w + ".presets[" + i + "].picture", file); });
      }
    } else if (f.type === "colour") {
      if (!HEX.test(f.default || "")) say(w + ".default must be a colour (#rrggbb)");
      if (f.choices !== undefined) choiceList(f.choices).forEach(id => { if (!HEX.test(id || "")) say(w + ".choices: each id is a colour (#rrggbb)"); });
    } else if (f.type === "colours") {
      if (f.swatches !== undefined) {
        if (!Array.isArray(f.swatches) || f.swatches.length < 2 || f.swatches.length > 24) say(w + ".swatches must be 2 to 24 of { name, hex }");
        else f.swatches.forEach((x, i) => { if (!x || typeof x !== "object" || !HEX.test(x.hex || "")) say(w + ".swatches[" + i + "].hex must be a colour (#rrggbb)"); str(x && x.name, 24, w + ".swatches[" + i + "].name"); });
      }
      if (!Number.isInteger(f.max) || f.max < 1 || f.max > 12) say(w + ".max must be 1 to 12 colours");
      if (f.min !== undefined && (!Number.isInteger(f.min) || f.min < 0 || f.min > (f.max || 0))) say(w + ".min must be 0 up to max");
      if (!Array.isArray(f.default) || f.default.length > (f.max || 0) || f.default.length < (f.min || 0) || f.default.some(x => !HEX.test(x || ""))) say(w + ".default must be a list of colours (#rrggbb), min to max of them");
    } else if (f.type === "photo") {
      // a picture the Host (and, in a group for Players, a Player) picks on the phone: Lamba shows the picker and the crop screen at this
      // shape, keeps the photo with the screen's room, and the app is given an address it can draw (or "" while there is none)
      const am = typeof f.aspect === "string" ? ASPECT.exec(f.aspect) : null;
      if (!am || +am[1] / +am[2] < .25 || +am[1] / +am[2] > 4) say(w + ".aspect must be the photo's shape as width:height, like \"4:3\" or \"1:1\" (between 1:4 and 4:1)");
      if (f.default !== undefined && f.default !== "") say(w + ".default must be \"\" (no photo yet: the app draws its own empty frame) or left out");
    } else if (f.type === "transforms") {
      if (!f.default || typeof f.default !== "object" || Array.isArray(f.default) || Object.keys(f.default).length) say(w + ".default must be {} (nothing moved yet)");
    } else if (f.type === "strokes") {
      if (!Number.isInteger(f.max) || f.max < 500 || f.max > 12000) say(w + ".max must be 500 to 12000 (the most characters of JSON the strokes may take)");
      if (!Number.isInteger(f.parts) || f.parts < 1 || f.parts > 12) say(w + ".parts must be 1 to 12 (how many parts, each with its own colour, the strokes fall into)");
      if (!f.default || typeof f.default !== "object" || !Array.isArray(f.default.tubes) || f.default.tubes.length) say(w + ".default must be { \"tubes\": [], \"names\": [] } (the app draws its own starting picture)");
    }
  }
  // forPlayers: which of Lamba's built-in controls Players may be offered (the Host decides which are on)
  if (m.forPlayers !== undefined) {
    if (!Array.isArray(m.forPlayers) || !m.forPlayers.length) say("forPlayers must be a list of " + FOR_PLAYERS.join(", "));
    else {
      m.forPlayers.forEach(x => { if (!FOR_PLAYERS.includes(x)) say("forPlayers: " + JSON.stringify(x) + " is not one of " + FOR_PLAYERS.join(", ")); });
      if (new Set(m.forPlayers).size !== m.forPlayers.length) say("forPlayers lists a control twice");
      if (m.guests !== true) say("forPlayers needs guests true (Players join the app)");
      if (m.forPlayers.includes("music") && m.music !== true) say("forPlayers music needs \"music\": true (the app uses Lamba's music)");
      if (m.forPlayers.includes("effects") && m.category === "kids") say("forPlayers: a kids app cannot offer Effects (Players never crack or fly over a kids app)");
    }
  }
  // Players' controls need Players' seats: everyone past players.max joins as a visitor, and visitors never change settings
  // (2026-11-17: Lamba Fireplace had players.max 0 and 200 visitors, so the Host's "Players can change app settings" did nothing)
  const seats = m.players && Number.isInteger(m.players.max) ? m.players.max : 0;
  const pg = m.settings && Array.isArray(m.settings.groups) && m.settings.groups.some(x => x && x.players === true);
  if (m.guests === true && seats === 0 && (pg || (Array.isArray(m.forPlayers) && m.forPlayers.length)))
    say("players.max is 0, so nobody is ever a Player: everyone joins as a visitor, and visitors never see the settings marked \"players\": true or forPlayers. Give players.max 1 or more (the first phones are Players and get the settings drawer, the rest are visitors), or remove \"players\": true and forPlayers");
  // the groups: tiles in the order shown; host parts placed where they are listed
  const seen = new Set(), used = new Set();
  if (!S.groups.length || S.groups.length > 16) say("settings.groups: 1 to 16");
  // "live" draws the whole picture, the same on every tile it is on: one tile may show it, the rest need their own icon (Neon, Nov 2026)
  if (S.groups.filter(g => g && g.icon === "live").length > 1) say("settings.groups: only one group's icon may be \"live\" (it is the whole picture, so two look the same); give the others { \"icon\": \"pictures/x.svg\" }");
  S.groups.forEach((g, i) => {
    const w = "settings.groups[" + i + "]";
    if (!g || typeof g !== "object") { say(w + " must be an object"); return; }
    if (g.host !== undefined) { if (!HOST_PARTS.includes(g.host)) say(w + ".host must be one of " + HOST_PARTS.join(", ")); if (seen.has("host:" + g.host)) say(w + ": " + g.host + " twice"); seen.add("host:" + g.host); return; }
    // { "action": key }: where an action's tile goes in the row (unplaced actions come first)
    if (g.action !== undefined) { if (!(Array.isArray(m.actions) && m.actions.some(a => a && a.key === g.action))) say(w + ".action must be the key of one of actions"); if (seen.has("action:" + g.action)) say(w + ": action " + g.action + " twice"); seen.add("action:" + g.action); return; }
    if (typeof g.key !== "string" || !GROUP.test(g.key)) say(w + ".key must be small letters, digits or dashes"); if (seen.has(g.key)) say(w + ".key " + g.key + " twice"); seen.add(g.key);
    if (HOST_GROUPS.includes(g.key)) say(w + ".key " + g.key + " is kept for the host");
    str(g.label, 24, w + ".label");
    // "players": true: the Player's phone gets this group as a tile too (the same picture tiles), as far as the Host allows
    if (g.players !== undefined && typeof g.players !== "boolean") say(w + ".players must be true or false");
    if (g.players === true) {
      if (m.guests !== true) say(w + ".players needs guests true (Players join the app)");
      if (Array.isArray(g.parts) && g.parts.some(x => x && x.app !== undefined)) say(w + ".players: an app part (parts[].app) is the Host's own page: a group for Players holds settings only");
    }
    if (g.value !== undefined && g.value !== "app") say(w + ".value must be \"app\" (the phone page describes it) or left out (the current choice)");
    checkPicture(g.icon, dir, say, w + ".icon", file);
    if (!Array.isArray(g.parts) || !g.parts.length || g.parts.length > 6) { say(w + ".parts: 1 to 6"); return; }
    const pk = new Set();
    g.parts.forEach((p, j) => {
      const v = w + ".parts[" + j + "]";
      if (!p || typeof p !== "object") { say(v + " must be an object"); return; }
      str(p.label, 24, v + ".label");
      if (p.app !== undefined) { if (typeof p.app !== "string" || !GROUP.test(p.app)) say(v + ".app must be the part's key (small letters)"); else if (pk.has(p.app)) say(v + ": " + p.app + " twice"); pk.add(p.app); if (!(m.screens && m.screens.phone)) say(v + ": an app part needs screens.phone"); return; }
      // { "label": "Photos", "photos": [{ "setting": "left", "label": "Left" }, { "setting": "right", "label": "Right" }] }: 2 to 4 photo
      // slots side by side in one part (shell/sdk/photo-host.js slots), each with Lamba's picker, crop, replace and remove
      if (p.photos !== undefined) {
        if (p.setting !== undefined) say(v + ": a part has photos or a setting, not both");
        if (!Array.isArray(p.photos) || p.photos.length < 2 || p.photos.length > 4) { say(v + ".photos: 2 to 4 photo slots, shown side by side ({ \"setting\", \"label\" } each)"); return; }
        p.photos.forEach((x, n) => {
          const u = v + ".photos[" + n + "]";
          if (!x || typeof x !== "object" || Array.isArray(x)) { say(u + " must be { \"setting\", \"label\" }"); return; }
          str(x.label, 12, u + ".label");
          if (!keys.includes(x.setting)) { say(u + ".setting must be one of settings.fields"); return; }
          const xf = S.fields[x.setting]; if (!xf || typeof xf !== "object" || xf.type !== "photo") say(u + ".setting must be a photo setting (type \"photo\"): " + x.setting + " is " + (xf && typeof xf === "object" && xf.type ? "a " + xf.type : "not one"));
          if (pk.has(x.setting)) say(u + ": " + x.setting + " twice"); pk.add(x.setting); used.add(x.setting);
        });
        return;
      }
      if (!keys.includes(p.setting)) { say(v + ".setting must be one of settings.fields"); return; }
      if (pk.has(p.setting)) say(v + ": " + p.setting + " twice"); pk.add(p.setting); used.add(p.setting);
      if (g.players === true && S.fields[p.setting] && ["strokes", "transforms"].includes(S.fields[p.setting].type)) say(v + ": a " + S.fields[p.setting].type + " setting is drawn on the Host's phone only, so it cannot be in a group for Players");
      if (p.presets !== undefined && p.presets !== true) say(v + ".presets must be true (a list setting's named collections)");
    });
  });
  for (const h of HOST_PARTS) if (!seen.has("host:" + h)) say("settings.groups: place { \"host\": \"" + h + "\" } where the host's " + h + " goes");
  keys.forEach(k => { if (!used.has(k) && !(S.fields[k] && S.fields[k].hidden)) say("settings.fields." + k + " is in no group (or mark it hidden: true)"); });
}

// the settings one part of a group holds: its setting, or each of its photo slots ({ photos: [{ setting, label }] }), else none (an app part)
const partKeys = p => !p || typeof p !== "object" ? [] : Array.isArray(p.photos) ? p.photos.map(x => x && x.setting).filter(k => typeof k === "string") : typeof p.setting === "string" ? [p.setting] : [];

// what a host needs from one manifest (the registry entry): everything except what only the developer needs
// a what's new note as the server keeps it: no HTML, no dashes, one line, 300 characters at most
const cleanNew = t => String(t == null ? "" : t).replace(/<[^>]*>/g, " ").replace(/[<>]/g, "").replace(/\s*[\u2013\u2014]\s*/g, ", ").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
function registryEntry(m) {
  const e = JSON.parse(JSON.stringify(m));
  delete e.lamba; delete e.$schema;
  e.askName = m.askName === true;
  e.clips = m.clips || []; e.listed = m.listed !== false; e.stagingOnly = m.stagingOnly === true; e.notInDemo = m.notInDemo !== false; e.liveCard = m.liveCard === true;
  // the settings a Player may change (the parts of the groups marked "players": true), for the room to check a Player's change
  e.playerKeys = ((m.settings || {}).groups || []).filter(g => g && g.players === true).flatMap(g => (g.parts || []).flatMap(partKeys)).filter((k, i, a) => a.indexOf(k) === i);
  e.live = Object.keys((m.settings || {}).fields || {}).filter(k => m.settings.fields[k].apply === "now");   // settings that go to the screen at once
  // money (docs/sdk/MONETIZE.md): the prices in one shape for the hosts and the store, null for a free app. For an app from
  // outside Lamba the server puts the prices its admin approved here instead (worker/money.js)
  const pay = payOf(m); if (pay) e.pay = pay;
  delete e.price; delete e.subscription; delete e.products; delete e.preview;
  return e;
}

// What to do about a problem the check found, in a few words ("" when its own words say it): the MCP tools' fixes
// (worker/devmcp.js) and the simulator's "Ask your AI to fix this" prompts (devs/simulator/sim.js)
const fixHint = p => /phone design: .*(Send|Undo)/.test(p) ? "Delete your Send, Undo and Reset buttons: Lamba's bar sends and undoes every setting change. Build settings in lamba.json (https://lamba.tv/devs/docs/ui/)."
  : /phone design: .*(Sound and Music|sound \/ music)/.test(p) ? "Delete your own sound, mute, volume or music control and add \"forPlayers\": [\"sound\", \"music\"] to lamba.json: Lamba shows its tiles."
  : /phone design: .*(dial|number setting)/.test(p) || /home-made slider/.test(p) ? "Delete the stepper, range or number input and put the value in lamba.json as a number setting (type \"number\", min, max, step): Lamba shows its dial."
  : /(part|group) label .* is long/.test(p) ? "Shorten the label to one or two words (about 12 letters): \"Photo 1\", not \"First picture\". Lamba shows it at its own size, so a long one makes the row swipe."
  : /phone design: .*(heading|profile|status)/.test(p) ? "Delete the heading, title, name corner and status line from phone.html: Lamba's chrome shows the app and who you are. Keep the page for the live action only."
  : /phone design: .*(tabs|grid)/.test(p) ? "Move the choices into a lamba.json group (\"players\": true for Players) with pictures on each choice: Lamba shows one row of tiles and one strip at a time."
  : /lamba\.json is not valid JSON/.test(p) ? "Fix the JSON on the line it names."
  : /no lamba\.json/.test(p) ? "Zip the folder that has lamba.json in it (or send lamba.json in files)."
  : /controller view|controls for the Host|nobody sees it/.test(p) ? "Move those buttons into lamba.json actions (one tap tiles) or settings, and delete that view."
  : /an emoji/.test(p) ? "Use words, or an SVG icon in the app's folder."
  : /needs a player remote/.test(p) ? "Add the view \"guest\" to phone.html: a full screen remote with one big main action."
  : /phone design: .*input type=file/.test(p) ? "Delete your own picture picker and add a photo setting to lamba.json ({ \"type\": \"photo\", \"aspect\": \"4:3\" } in a group part): Lamba shows the picker and the crop, and your app draws the address in Lamba.settings."
  : /hold to|holding/.test(p) ? "Put it on a visible control: a button or a tile with a picture. Hold only as a bonus."
  : /no sound control/.test(p) ? "Add \"forPlayers\": [\"sound\"] to lamba.json: Lamba gives Players the screen's volume, if the Host allows it."
  : /asks the Player for a name/.test(p) ? "Remove the name field and read Lamba.me().name."
  : /placeholder clips/.test(p) ? "Record two real clips of the app (540 x 920 H.264 mp4, 6 to 14 s) and their -poster.webp."
  : /clips?/.test(p) ? "Add two clips (clips/<name>.mp4 and clips/<name>-poster.webp) and list them in lamba.json clips."
  : /Chrome 61/.test(p) ? "Screen pages run on Chrome 61: write ES5, no ?. or ??, no object spread, no optional catch binding."
  : /en or em dash/.test(p) ? "Use a comma or a full stop instead."
  : /outside/.test(p) ? "List the https://host in lamba.json outside, or stop reaching it."
  : /storage/.test(p) ? "Keep data with Lamba.store instead."
  : /video|audio/.test(p) ? "Films go through Lamba.film(canvas, url), sound through Lamba.sound.context() (Web Audio)."
  : /taken|belongs to one of Lamba/.test(p) ? "Change id in lamba.json and the folder's name."
  : /user-scalable/.test(p) ? "Add user-scalable=no to the phone page's viewport meta."
  : /lamba\.js(?!on)/.test(p) ? "Load ../../shell/sdk/lamba.js on every page."
  : /hidden file|kind of file|file names may|leaves the app|backslash|top of a disk/.test(p) ? "Rename or remove that file."
  : "";

return { MANIFEST_VERSION, ID, NAME_MAX, nameProblem, HOST_KEYS, TYPES, PERMISSIONS, AGES, CATEGORIES, SHELVES, FOR_PLAYERS, HOST_PARTS, HOST_GROUPS, inside, checkRules, PRICE_TIERS, TRIAL_MAX, PREVIEW_MODES, PRODUCTS_MAX, PAY_HOSTS, paidOf, kidsOf, money, split, payOf, priceLabel, ACTIONS_MAX, partKeys, cleanNew, registryEntry, fixHint };
})();

// ---- tools/sdk_perf.mjs ----
const M_perf = (() => {
// Lamba's automated review of how an app runs on real screens (docs/sdk/REVIEW.md "The automated review"). Three parts,
// with no reach into the disk or the network, so the server (worker/review.js), the simulator (devs/simulator/sim.js,
// through the bundle tools/sdk_kit.mjs makes) and the kit (lamba-check.mjs, lamba-test.mjs --perf) share the very same code:
//   perfStatic({ manifest, paths, text, acorn })  the code read without running it: style or filter writes inside
//                                                  requestAnimationFrame callbacks, timers that redraw the whole scene, loops
//                                                  that never stop, a film floor with no lighter copy, sound with no unlock
//   measuredFindings(raw, manifest)                what the simulator measured (?measure=1: the probe in seal.js, the run in
//                                                  sim.js measureRun): loops still running when idle, style writes a frame,
//                                                  timers redrawing the screen, long tasks, memory, the film, the join card,
//                                                  sound, the Player's phone at phone size
//   devPrompt({ name, id, ver, findings })         one ready-to-paste prompt for the developer's AI
// A finding: { id, severity: "must" | "should", title, where: ["scene.js:61"], evidence: [sentences with numbers],
// why (what it does on a real screen), fix (exactly what to change), from: ["code" | "measured" | "check" | "ai"] }.
// mergeFindings(list) joins the ones with the same id (the code and the measurement of one problem), must first.
// Plain words: no en or em dashes, never "TV" (the screen), the Host and Players.

const SCREEN_RULES = "docs/sdk/DESIGN.md (One recording layer, few animation loops)";

// ---------- reading the code ----------
const lineOf = (s, i) => { let n = 1; for (let k = 0; k < i && k < s.length; k++) if (s.charCodeAt(k) === 10) n++; return n; };
function walk(node, fn, parent) {
  if (!node || typeof node.type !== "string") return;
  if (fn(node, parent) === false) return;
  for (const k in node) {
    if (k === "loc" || k === "start" || k === "end" || k === "range") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") walk(c, fn, node); }
    else if (v && typeof v.type === "string") walk(v, fn, node);
  }
}
function walkA(node, fn, up) {   // the same, with the nodes above: fn(node, ancestors)
  if (!node || typeof node.type !== "string") return;
  up = up || [];
  if (fn(node, up) === false) return;
  const next = up.concat([node]);
  for (const k in node) {
    if (k === "loc" || k === "start" || k === "end" || k === "range") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") walkA(c, fn, next); }
    else if (v && typeof v.type === "string") walkA(v, fn, next);
  }
}
// on a way out (a block that ends in return): the write that stops an effect, not one made every frame
const onExit = up => up.some(b => b.type === "BlockStatement" && b.body.some(st => st.type === "ReturnStatement") && up.indexOf(b) > 0 && up[up.indexOf(b) - 1].type === "IfStatement");
const isFn = n => n && (n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression" || n.type === "FunctionDeclaration");
const nameOfCallee = c => !c ? "" : c.type === "Identifier" ? c.name : c.type === "MemberExpression" && !c.computed && c.property ? c.property.name : "";
const objName = c => c && c.type === "MemberExpression" && c.object ? (c.object.type === "Identifier" ? c.object.name : c.object.type === "MemberExpression" && !c.object.computed ? c.object.property.name : "") : "";

// the scripts of the screen: its page's inline scripts (with where each starts in the page) and its own script files
function screenScripts(o) {
  const m = o.manifest || {}, sc = m.screens || {}, has = new Set(o.paths || []), out = [];
  const text = p => has.has(p) ? o.text(p) : null;
  const pages = [...new Set([sc.tv, sc.picture].filter(p => typeof p === "string" && has.has(p)))];
  const seen = new Set();
  for (const p of pages) {
    const html = text(p); if (typeof html !== "string") continue;
    for (const s of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const src = (s[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i) || [])[1];
      if (!src) { out.push({ file: p, code: s[2], line0: lineOf(html, s.index + s[0].indexOf(">") + 1) - 1 }); continue; }
      if (/^[a-z]+:|^\/\//i.test(src) || /shell\/sdk\//.test(src)) continue;
      const f = src.split(/[?#]/)[0].replace(/^\.\//, "");
      const dir = p.split("/").slice(0, -1);
      const parts = dir.concat(f.split("/")), rel = [];
      for (const x of parts) { if (x === "" || x === ".") continue; if (x === "..") rel.pop(); else rel.push(x); }
      const path = rel.join("/");
      if (has.has(path) && !seen.has(path)) { seen.add(path); const t = text(path); if (typeof t === "string") out.push({ file: path, code: t, line0: 0 }); }
    }
  }
  return out;
}

// One script's facts: named functions, the callbacks of requestAnimationFrame and setInterval, film options
function factsOf(script, acorn) {
  let ast = null;
  try { ast = acorn.parse(script.code, { ecmaVersion: 2020, sourceType: "script", locations: true, allowReturnOutsideFunction: true }); } catch (e) { return null; }
  const at = n => script.file + ":" + (script.line0 + (n.loc ? n.loc.start.line : 1));
  const fns = {}, objects = {}, rafNames = new Set(["requestAnimationFrame"]), raf = [], timers = [], filmOpts = [], cleared = new Set();
  walk(ast, (n, p) => {
    if (n.type === "FunctionDeclaration" && n.id) fns[n.id.name] = n;
    if (n.type === "VariableDeclarator" && n.id && n.id.type === "Identifier" && n.init) {
      if (isFn(n.init)) fns[n.id.name] = n.init;
      if (n.init.type === "ObjectExpression") objects[n.id.name] = n.init;
      // var raf = window.requestAnimationFrame || ...: an alias
      let aliased = false; walk(n.init, x => { if (nameOfCallee(x) === "requestAnimationFrame" && (x.type === "Identifier" || x.type === "MemberExpression")) aliased = true; });
      if (aliased && !isFn(n.init)) rafNames.add(n.id.name);
    }
    if (n.type === "AssignmentExpression" && n.left.type === "Identifier" && isFn(n.right)) fns[n.left.name] = n.right;
    if (n.type === "CallExpression" && /^clear(Interval|Timeout)$/.test(nameOfCallee(n.callee)) && n.arguments[0]) cleared.add(n.arguments[0].type === "Identifier" ? n.arguments[0].name : "?");
  });
  walk(ast, (n, p) => {
    if (n.type !== "CallExpression") return;
    const name = nameOfCallee(n.callee);
    if (rafNames.has(name) && n.callee.type === "Identifier" || name === "requestAnimationFrame") raf.push({ call: n, cb: n.arguments[0] });
    if (name === "setInterval" && n.arguments.length >= 2) {
      const d = n.arguments[1], ms = d.type === "Literal" && typeof d.value === "number" ? d.value : null;
      const kept = p && p.type === "VariableDeclarator" && p.id.type === "Identifier" ? p.id.name : p && p.type === "AssignmentExpression" && p.left.type === "Identifier" ? p.left.name : "";
      timers.push({ call: n, cb: n.arguments[0], ms, kept });
    }
  });
  walk(ast, n => { if (n.type === "ObjectExpression" && n.properties.some(q => q.key && (q.key.name || q.key.value) === "minQuality")) filmOpts.push(n); });
  return { ast, at, fns, objects, raf, timers, filmOpts, cleared, code: script.code, file: script.file, line0: script.line0 };
}
const fnOf = (F, cb) => !cb ? null : isFn(cb) ? cb : cb.type === "Identifier" ? F.fns[cb.name] || null : null;
// what a function does, with the named functions it calls (two levels): style writes, filter writes, drawImage calls
function effects(F, fn, depth, seen) {
  const out = { style: [], filter: [], ctxFilter: [], draws: 0, drawAt: null };
  if (!fn || seen.has(fn)) return out; seen.add(fn);
  walkA(fn.body, (n, up) => {
    if (n !== fn.body && isFn(n) && n.type !== "ArrowFunctionExpression") return false;   // a function made inside runs later, not now
    if (n.type === "AssignmentExpression" && n.left.type === "MemberExpression" && !onExit(up)) {
      const L = n.left, prop = L.computed ? "" : L.property.name;
      if (L.object.type === "MemberExpression" && !L.object.computed && L.object.property.name === "style") {
        (prop === "filter" || prop === "webkitFilter" ? out.filter : out.style).push({ at: F.at(n), prop, el: objName(L.object) });
      } else if (prop === "cssText" && L.object.type === "MemberExpression" && L.object.property && L.object.property.name === "style") out.style.push({ at: F.at(n), prop: "cssText", el: objName(L.object) });
      else if (prop === "filter") out.ctxFilter.push({ at: F.at(n), el: L.object.type === "Identifier" ? L.object.name : "" });
    }
    if (n.type === "CallExpression") {
      const nm = nameOfCallee(n.callee);
      if (nm === "setProperty" && n.callee.object && n.callee.object.type === "MemberExpression" && n.callee.object.property.name === "style") {
        const a0 = n.arguments[0], prop = a0 && a0.type === "Literal" ? String(a0.value) : "";
        (/filter$/.test(prop) ? out.filter : out.style).push({ at: F.at(n), prop, el: objName(n.callee.object) });
      }
      if (nm === "drawImage" || nm === "putImageData") { out.draws++; if (!out.drawAt) out.drawAt = F.at(n); }
      if (depth > 0 && n.callee.type === "Identifier" && F.fns[n.callee.name]) {
        const e = effects(F, F.fns[n.callee.name], depth - 1, seen);
        out.style.push(...e.style); out.filter.push(...e.filter); out.ctxFilter.push(...e.ctxFilter); out.draws += e.draws; if (!out.drawAt) out.drawAt = e.drawAt;
      }
    }
  });
  return out;
}
const strings = (F, node) => {   // the string values an expression may be: a literal, an array of them, a member of a known object
  const out = [];
  const one = x => {
    if (!x) return;
    if (x.type === "Literal" && typeof x.value === "string") out.push(x.value);
    else if (x.type === "ArrayExpression") x.elements.forEach(one);
    else if (x.type === "MemberExpression" && x.object.type === "Identifier" && F.objects[x.object.name]) F.objects[x.object.name].properties.forEach(q => one(q.value));
    else if (x.type === "Identifier" && F.objects[x.name]) F.objects[x.name].properties.forEach(q => one(q.value));
  };
  one(node); return out;
};

function perfStatic(o) {
  const acorn = o.acorn, F = [], out = [];
  if (!acorn) return out;
  for (const s of screenScripts(o)) { const f = factsOf(s, acorn); if (f) F.push(f); }
  const add = x => out.push(Object.assign({ from: ["code"] }, x));
  for (const f of F) {
    // 1. style and filter writes inside requestAnimationFrame callbacks
    const done = new Set();
    for (const r of f.raf) {
      const fn = fnOf(f, r.cb); if (!fn || done.has(fn)) continue; done.add(fn);
      const e = effects(f, fn, 2, new Set()), name = r.cb.type === "Identifier" ? r.cb.name : "an animation callback";
      if (e.filter.length) add({ id: "film-filter", severity: "must", title: "A CSS filter is changed on every animation frame",
        where: [...new Set(e.filter.map(x => x.at))], evidence: e.filter.slice(0, 3).map(x => x.at + ": " + (x.el ? x.el + "." : "") + "style." + x.prop + " is set inside " + name + ", which requestAnimationFrame runs every frame"),
        why: "Each new filter value makes the screen recompose the whole layer under it. On an old screen with a film behind it, that alone cut the film from 25 to about 17 pictures a second (Lamba Fireplace, 2026-11-17).",
        fix: "Set the filter once when the look changes (a setting, a hold starting or ending), never inside the frame loop. For a glow that follows the action, draw it on your small effects canvas (globalAlpha, a gradient) instead of filtering the film canvas. " + SCREEN_RULES + "." });
      const st = e.style.filter(x => x.prop !== "display");
      if (st.length) add({ id: "style-per-frame", severity: "should", title: "Styles are written on every animation frame",
        where: [...new Set(st.map(x => x.at))], evidence: st.slice(0, 3).map(x => x.at + ": " + (x.el ? x.el + "." : "") + "style." + x.prop + " is set inside " + name),
        why: "Style changes every frame make the screen work out the layout and repaint again each time, which old screens cannot do at 25 pictures a second.",
        fix: "Change styles only when something changes (compare with the last value and skip when equal), or animate with a CSS transition, or draw it on a canvas." });
      if (e.ctxFilter.length) add({ id: "canvas-filter-frame", severity: "should", title: "A canvas filter is used on every animation frame",
        where: [...new Set(e.ctxFilter.map(x => x.at))], evidence: e.ctxFilter.slice(0, 2).map(x => x.at + ": " + (x.el ? x.el + "." : "") + "filter is set inside " + name),
        why: "A canvas filter runs over every pixel drawn after it. Old screens draw it on the processor, slowly.",
        fix: "Draw the filtered picture once into a spare canvas when the look changes, then draw that copy each frame." });
      // a loop that asks for the next frame first thing, with no way out
      if (r.cb.type === "Identifier" && fn.body && fn.body.type === "BlockStatement") {
        const top = fn.body.body, i = top.findIndex(st => st.type === "ExpressionStatement" && st.expression && (st.expression.type === "CallExpression" && f.raf.some(x => x.call === st.expression) || st.expression.type === "AssignmentExpression" && f.raf.some(x => x.call === st.expression.right)));
        const before = i < 0 ? [] : top.slice(0, i);
        let exits = false; before.forEach(st => walk(st, n => { if (n.type === "ReturnStatement") exits = true; if (isFn(n)) return false; }));
        if (i > -1 && !exits && f.filmOpts.length + F.reduce((a, g) => a + (/\bLamba\.film\s*\(|\.film\s*\(/.test(g.code) ? 1 : 0), 0) > 0)
          add({ id: "raf-idle", severity: "should", title: "An animation loop over the film never stops",
            where: [f.at(top[i])], evidence: [f.at(top[i]) + ": " + name + " asks for the next frame every time, with no way to stop"],
            why: "The film already moves the picture. A second loop that runs all the time costs an old screen frames even when nothing happens.",
            fix: "Run the loop only while its effect is visible (start it when a hold or a burst begins, stop it with cancelAnimationFrame when the last spark is gone). " + SCREEN_RULES + "." });
      }
    }
    // 2. timers that redraw the scene
    for (const t of f.timers) {
      const fn = fnOf(f, t.cb); if (!fn) continue;
      const e = effects(f, fn, 2, new Set()), at = f.at(t.call);
      if (t.ms !== null && t.ms <= 250 && e.draws > 0) add({ id: "interval-redraw", severity: "must", title: "A timer redraws the scene every " + t.ms + " ms",
        where: [at], evidence: [at + ": setInterval every " + t.ms + " ms calls code with " + e.draws + " drawImage call" + (e.draws === 1 ? "" : "s") + (e.drawAt ? " (" + e.drawAt + ")" : "")],
        why: "Redrawing a full-screen canvas " + Math.round(1000 / t.ms) + " times a second on a timer competes with the film and the page for every frame, and keeps going when nothing changes.",
        fix: "Draw the scene once when something changes (a setting, a log added, the screen's size). Put what moves on its own small canvas, or into the requestAnimationFrame loop that already runs, and only while it moves." });
      else if (t.ms !== null && t.ms <= 100 && !(t.kept && (f.cleared.has(t.kept) || F.some(g => g.cleared.has(t.kept))))) add({ id: "interval-always", severity: "should", title: "A timer runs every " + t.ms + " ms, all the time",
        where: [at], evidence: [at + ": setInterval every " + t.ms + " ms is never cleared"],
        why: "A fast timer that never stops wakes the screen " + Math.round(1000 / t.ms) + " times a second for the whole time the app is on, even when nobody is doing anything.",
        fix: "Start the timer when something begins (a hold, a burst) and clear it when it ends, or use setTimeout for the one moment you need." });
    }
    // 3. a film floor with no lighter copy
    for (const ob of f.filmOpts) {
      const films = ob.properties.find(q => q.key && (q.key.name || q.key.value) === "films"), low = ob.properties.find(q => q.key && (q.key.name || q.key.value) === "low");
      const list = films ? strings(f, films.value) : [], at = f.at(ob);
      if ((films && list.length && !list.some(s => /-360\.film$/.test(s))) || (low && low.value.type === "Literal" && low.value.value === false))
        add({ id: "min-quality", severity: "should", title: "A film floor (minQuality) with no lighter copy to fall back on",
          where: [at], evidence: [at + ": minQuality is set and " + (list.length ? "films lists " + new Set(list).size + " cop" + (new Set(list).size === 1 ? "y" : "ies") + " (" + [...new Set(list)].filter(s => /-720\.film$/.test(s)).concat([...new Set(list)]).slice(0, 1) + ", ...)" : "low is false") + ", none of them a -360 copy"],
          why: "minQuality keeps a screen at 720 lines only while it plays smoothly. A screen measured too slow goes under the floor, and with no 360 copy listed it has only the still picture left.",
          fix: "List the 360 copy last in films (films: [\"films/x.film\", \"films/x-720.film\", \"films/x-360.film\"]) or leave films out so Lamba finds x-720.film and x-360.film itself. Make them with node lamba-film.mjs. docs/sdk/FILMS.md (A quality floor)." });
    }
  }
  // 4. sound with no unlock (all screen scripts together)
  const all = F.map(f => f.code).join("\n");
  if (/\bsound\s*\.\s*context\s*\(/.test(all) && !/\bsound\s*\.\s*(unlocked|onUnlock)\b/.test(all)) {
    const f = F.find(g => /\bsound\s*\.\s*context\s*\(/.test(g.code)), at = f.file + ":" + (f.line0 + lineOf(f.code, f.code.search(/\bsound\s*\.\s*context\s*\(/)));
    add({ id: "sound-unlock", severity: "should", title: "Sound starts without waiting for the screen to allow it",
      where: [at], evidence: [at + ": Lamba.sound.context() is used, and no script reads Lamba.sound.unlocked or Lamba.sound.onUnlock"],
      why: "Screen browsers play sound only after a button on the remote. Sound started before that is lost, and never starts later on its own.",
      fix: "Start sound in Lamba.sound.onUnlock(function () { ... }) and check Lamba.sound.unlocked before each sound. docs/sdk/SDK.md (Lamba.sound.unlocked)." });
  }
  return mergeFindings(out);
}
// sentences for lamba check (its warnings): one a finding
const perfWarnings = list => list.map(x => (x.where && x.where[0] ? x.where[0] + ": " : "") + x.title + ". " + x.fix);

// ---------- what the simulator measured ----------
// raw (sim.js measureRun): { v, dur, screen: [w, h], phases: { settle, base, act, idle: [from, to] in s }, tv: probe, player: probe,
// joincard: [{ t, share, cx, cy, on }], words: { type: n }, problems: [sentences], sound: { unlockAt } }
// probe (seal.js): { sec: { s: bucket }, loops: { key: { name, site, n } }, timers: [{ ms, site, ticks, draws, px, cleared }], filmFilterSite,
// styleSite, film: { fps: [], rung, under, floor }, mem: [[t, bytes]], canvases, audio: { sources, locked, first }, unlocked, longtasks, layout }
const R = n => Math.round(n), R1 = n => Math.round(n * 10) / 10;
function sumOver(probe, from, to, k) { let s = 0; if (!probe || !probe.sec) return 0; for (const t in probe.sec) if (+t >= from && +t < to) s += probe.sec[t][k] || 0; return s; }
const perSec = (probe, ph, k) => !ph ? 0 : sumOver(probe, ph[0], ph[1], k) / Math.max(1, ph[1] - ph[0]);
function measuredFindings(raw, manifest) {
  const out = [], m = manifest || {}, tv = raw && raw.tv, pl = raw && raw.player, ph = (raw && raw.phases) || {};
  if (!raw || !tv) return out;
  const add = x => out.push(Object.assign({ from: ["measured"] }, x));
  // the idle part of each loop, timer and canvas count (the probe keeps them second by second)
  const inIdle = o => { let n = 0; if (ph.idle && o) for (const s in o) if (+s >= ph.idle[0] && +s < ph.idle[1]) n += o[s]; return n; };
  for (const key in tv.loops || {}) { const l = tv.loops[key]; if (l.sec) l.idle = inIdle(l.sec); }
  for (const t of tv.timers || []) if (t.sec) { t.idleTicks = inIdle(t.sec); t.idlePx = inIdle(t.px); }
  if (tv.canvasSec) tv.canvasesIdle = inIdle(tv.canvasSec);
  const [W, H] = raw.screen || [960, 540], area = W * H, film = tv.film || {}, hasFilm = !!(film.made || (film.fps && film.fps.length));
  const busy = ph.act ? [ph.base ? ph.base[0] : ph.act[0], ph.act[1]] : ph.base;
  // the film canvas's filter, each frame
  const ff = Math.max(perSec(tv, ph.act, "filmFilterW"), perSec(tv, ph.base, "filmFilterW"), perSec(tv, ph.idle, "filmFilterW"));
  if (ff >= 5) add({ id: "film-filter", severity: "must", title: "A CSS filter is changed on every animation frame",
    where: tv.filmFilterSite ? [tv.filmFilterSite] : [], evidence: ["The film canvas's style.filter was set " + R(ff) + " times a second" + (tv.filmFilterSite ? " (" + tv.filmFilterSite + ")" : "") + " while " + (perSec(tv, ph.act, "filmFilterW") >= ff ? "a Player held the main key" : "the app ran")],
    why: "Each new filter value makes the screen recompose the film's whole layer. On an old screen that cut the film from 25 to about 17 pictures a second.",
    fix: "Set the filter once when the look changes, never inside the frame loop; draw a glow on the small effects canvas instead." });
  const sw = Math.max(perSec(tv, ph.act, "styleW"), perSec(tv, ph.base, "styleW"), perSec(tv, ph.idle, "styleW"));
  if (sw >= 20) add({ id: "style-per-frame", severity: "should", title: "Styles are written on every animation frame",
    where: tv.styleSite ? [tv.styleSite] : [], evidence: [R(sw) + " style writes a second inside animation frames" + (tv.styleSite ? " (the first at " + tv.styleSite + ")" : "")],
    why: "Each one makes the screen work out the layout and repaint again.", fix: "Write a style only when its value changes, or draw it on a canvas." });
  // loops still running with nothing happening
  const idleLoops = Object.keys(tv.loops || {}).map(k => tv.loops[k]).filter(l => (l.idle || 0) / Math.max(1, ph.idle ? ph.idle[1] - ph.idle[0] : 1) >= 10);
  if (ph.idle && idleLoops.length && (hasFilm || idleLoops.length > 1)) {
    const secs = ph.idle[1] - ph.idle[0];
    add({ id: "raf-idle", severity: hasFilm ? "must" : "should", title: hasFilm ? "An animation loop keeps running over the film when nothing happens" : "Several animation loops run when nothing happens",
      where: idleLoops.map(l => l.site).filter(Boolean), evidence: idleLoops.map(l => (l.name || "a requestAnimationFrame callback") + " ran " + R(l.idle / secs) + " times a second for " + secs + " s after the last tap" + (l.site ? " (" + l.site + ")" : "")),
      why: "With nothing moving but the film, every extra frame of work is taken from the film on an old screen, and the screen never rests.",
      fix: "Stop the loop (cancelAnimationFrame, or do not ask for the next frame) once its sparks are gone; start it again when a hold or a burst begins." });
  }
  // timers that redraw the screen
  for (const t of (tv.timers || []).filter(x => !/^shell\//.test(x.site || ""))) {   // (Lamba's own film player has its timer)
    const ticks = t.idleTicks || 0, px = ticks ? (t.idlePx || 0) / ticks : 0;
    const share = px / area, said = share >= 1.05 ? R1(share) + " times the screen's pixels" : R(share * 100) + "% of the screen's pixels";
    if (t.ms <= 250 && ticks >= 3 && share >= 0.4) add({ id: "interval-redraw", severity: "must", title: "A timer redraws the scene every " + t.ms + " ms",
      where: t.site ? [t.site] : [], evidence: ["setInterval every " + t.ms + " ms drew " + said + " on each of " + ticks + " ticks while nothing happened" + (t.site ? " (" + t.site + ")" : "")],
      why: "A full redraw " + R(1000 / t.ms) + " times a second competes with the film for every frame and never stops.",
      fix: "Redraw only when something changes; animate what moves on its own small canvas, and only while it moves." });
    else if (t.ms <= 100 && ph.idle && ticks >= 0.8 * (ph.idle[1] - ph.idle[0]) * 1000 / Math.max(16, t.ms)) add({ id: "interval-always", severity: "should", title: "A timer runs every " + t.ms + " ms, all the time",
      where: t.site ? [t.site] : [], evidence: ["setInterval every " + t.ms + " ms ticked " + ticks + " times while nothing happened" + (t.site ? " (" + t.site + ")" : "")],
      why: "A fast timer that never stops wakes the screen " + R(1000 / t.ms) + " times a second, even when nobody is doing anything.",
      fix: "Start the timer when something begins and clear it when it ends." });
  }
  // long tasks
  const lt = sumOver(tv, 0, 1e9, "lt"), dur = raw.dur || 60;
  if (lt / dur * 10 >= 500) add({ id: "long-tasks", severity: lt / dur * 10 >= 2000 ? "must" : "should", title: "The screen page blocks for long stretches",
    where: [], evidence: [R(lt) + " ms of tasks longer than 50 ms in " + R(dur) + " s (" + R(lt / dur * 10) + " ms every 10 s) on this computer; an old screen is about 4 times slower"],
    why: "While a task runs, nothing else moves: the film and the join card stutter.",
    fix: "Split heavy work (decoding pictures, building caches) across frames, and do it once at load, not on each change." });
  // memory
  const mem = tv.mem || [];
  if (mem.length >= 2) {
    const a = mem.find(x => x[0] >= 10) || mem[0], b = mem[mem.length - 1], grew = b[1] - a[1];
    if (grew > 20e6 && grew > a[1] * 0.3) add({ id: "memory", severity: "should", title: "Memory keeps growing",
      where: [], evidence: ["The screen page's memory grew from " + R(a[1] / 1e6) + " MB to " + R(b[1] / 1e6) + " MB between " + a[0] + " s and " + b[0] + " s"],
      why: "Old screens have little memory: a page that keeps growing is reloaded by the browser or slows down after an hour.",
      fix: "Reuse canvases and pictures instead of making new ones; cap lists (sparks, logs) and drop what is gone." });
  }
  if ((tv.canvasesIdle || 0) > 20) add({ id: "canvases", severity: "should", title: "New canvases are made all the time",
    where: tv.canvasSite ? [tv.canvasSite] : [], evidence: [tv.canvasesIdle + " canvases made while nothing happened"], why: "Each canvas holds its own picture in memory.", fix: "Make a canvas once and reuse it." });
  // the film
  if (film.made && !(film.fps || []).some(x => x > 0)) add({ id: "film-none", severity: "must", title: "The film never played",
    where: [], evidence: ["Lamba.film was called, but no picture of it was shown in " + R(dur) + " s"], why: "People see the still picture, or nothing.", fix: "Check the film's address and that name.film is in the folder (node lamba-film.mjs makes it)." });
  if (film.under) add({ id: "film-under", severity: "should", title: "The film played under its quality floor",
    where: [], evidence: ["The film went under minQuality " + (film.floor || "") + " (rung " + (film.rung || "?") + ") on this computer"], why: "This computer could not play the copies at the floor smoothly; old screens will do worse.", fix: "Lighten the scene around the film (fewer layers and loops), or lower the floor." });
  // the join card
  const jc = (raw.joincard || []).filter(x => x.on);
  if (jc.length) {
    const big = jc.filter(x => x.share >= 0.12), middle = big.filter(x => Math.abs(x.cx - .5) < .2 && Math.abs(x.cy - .5) < .2), cats = [].concat(m.categories || [], m.category || []);
    const ambient = cats.some(c => ["ambient", "art", "clocks", "calm"].includes(c));
    if (ambient && middle.length >= 3) add({ id: "joincard-middle", severity: "should", title: "The join card sits in the middle of the scene",
      where: [], evidence: ["The card covered " + R(Math.max(...middle.map(x => x.share)) * 100) + "% of the screen, in the middle, for " + middle.length + " s"], why: "An ambient app is art on the wall: a big card in the middle hides it.", fix: "Ask for Lamba.joinCard({ show: true, size: \"corner\" }) once someone is connected, and leave the corner free." });
    else if (big.length > 40) add({ id: "joincard-big", severity: "should", title: "The big join card stays up", where: [], evidence: ["The card covered " + R(Math.max(...big.map(x => x.share)) * 100) + "% of the screen for " + big.length + " s"], why: "People cannot see the app behind it.", fix: "Ask for size \"corner\" once someone has joined." });
  }
  const jw = (raw.words || {}).joincard || 0;
  if (jw > Math.max(6, dur / 6)) add({ id: "joincard-often", severity: "should", title: "The join card is asked for again and again",
    where: [], evidence: ["Lamba.joinCard was called " + jw + " times in " + R(dur) + " s"], why: "Each call can bring the card back or move it.", fix: "Call it when the number of people changes between none and some, not on every message." });
  // sound
  const au = tv.audio || {}, perms = Array.isArray(m.permissions) ? m.permissions : [];
  if (au.locked > 0) add({ id: "sound-unlock", severity: "should", title: "Sound starts before the screen allows it",
    where: au.lockedSite ? [au.lockedSite] : [], evidence: [au.locked + " sound" + (au.locked === 1 ? "" : "s") + " started before the remote's first button (lost on a real screen)"],
    why: "Screen browsers play sound only after a button on the remote.", fix: "Start sound in Lamba.sound.onUnlock and check Lamba.sound.unlocked before each sound." });
  if (perms.includes("sound") && raw.sound && raw.sound.unlockAt && !(au.after > 0) && !(au.media > 0)) add({ id: "sound-silent", severity: "should", title: "No sound after the screen allowed it",
    where: [], evidence: ["lamba.json asks for sound, but nothing played in the " + R((ph.idle ? ph.idle[1] : dur) - raw.sound.unlockAt) + " s after the remote's button"],
    why: "People expect the sound the app promises once they press a button.", fix: "Start the sound in Lamba.sound.onUnlock, or remove \"sound\" from permissions." });
  if (raw.notDrawn) add({ id: "not-drawn", severity: "must", title: "The screen never said it had drawn", where: [], evidence: ["Lamba.drawn() was not called within 60 s of the screen page loading"],
    why: "Lamba fades the screen in only after Lamba.drawn(): until then people see nothing.", fix: "Call Lamba.drawn() once the first picture is on the screen, even when a picture or a film failed to load." });
  // errors
  const errs = (raw.problems || []).filter(p => !/^note/.test(p));
  if (errs.length) add({ id: "errors", severity: "must", title: "Errors while it ran", where: [], evidence: errs.slice(0, 5), why: "An error can stop the screen or the phone halfway.", fix: "Fix each error; run node lamba-test.mjs to see them with their place." });
  // the Player's phone at phone size
  const lay = pl && pl.layout;
  if (lay) {
    const at = " at " + lay.w + " x " + lay.h;
    if (lay.small && lay.small.length) add({ id: "tap-small", severity: "should", title: "Keys smaller than a finger on the Player's phone", where: [],
      evidence: lay.small.slice(0, 4).map(s => "\"" + s.label + "\" is " + s.w + " x " + s.h + " px" + at), why: "People tap without looking at a phone held in one hand; under 44 px they miss.", fix: "Make every key at least 44 x 44 px (padding counts)." });
    if (lay.overlap && lay.overlap.length) add({ id: "tap-overlap", severity: "should", title: "Keys overlap on the Player's phone", where: [],
      evidence: lay.overlap.slice(0, 3).map(s => "\"" + s[0] + "\" and \"" + s[1] + "\" overlap" + at), why: "A tap lands on the wrong key.", fix: "Lay the keys out so none covers another at every phone size." });
    if (lay.scrollY || lay.scrollX) add({ id: "phone-scroll", severity: "should", title: "The Player's remote scrolls", where: [],
      evidence: ["The page is " + lay.sw + " x " + lay.sh + " px in a " + lay.w + " x " + lay.h + " phone"], why: "A remote fills the phone and never moves under a finger.", fix: "Fit the remote to the phone's height (100% height, flex), and test at 375 x 667 and sideways." });
    if (lay.off && lay.off.length) add({ id: "phone-off", severity: "should", title: "Keys outside the Player's screen", where: [], evidence: lay.off.slice(0, 3).map(s => "\"" + s + "\" is outside the screen" + at), why: "People cannot reach them.", fix: "Keep every key inside the phone's screen, sideways too." });
  }
  return mergeFindings(out);
}

// ---------- one list, and the prompt ----------
const RANK = { must: 0, should: 1 };
function mergeFindings(list) {
  const by = new Map(), out = [];
  for (const x of list || []) {
    if (!x || !x.title) continue;
    const k = x.id || x.title, y = by.get(k);
    if (!y) { const c = { id: x.id || "", severity: x.severity === "must" ? "must" : "should", title: x.title, where: (x.where || []).slice(), evidence: (x.evidence || []).slice(), why: x.why || "", fix: x.fix || "", from: (x.from || []).slice() }; by.set(k, c); out.push(c); continue; }
    if (x.severity === "must") y.severity = "must";
    for (const w of x.where || []) if (!y.where.includes(w)) y.where.push(w);
    for (const e of x.evidence || []) if (!y.evidence.includes(e)) y.evidence.push(e);
    for (const f of x.from || []) if (!y.from.includes(f)) y.from.push(f);
    if (!y.why && x.why) y.why = x.why; if (!y.fix && x.fix) y.fix = x.fix;
  }
  return out.sort((a, b) => RANK[a.severity] - RANK[b.severity]);
}
// the check's own sentences (what lamba check says today about the version's files) as findings
function checkFindings(problems, warnings) {
  const one = (s, sev) => { const m = String(s).match(/^([\w./-]+\.(?:html|js|json|css|svg|film)(?::\d+)?):\s*/); return { id: "check:" + String(s).slice(0, 80), severity: sev, title: String(s).replace(/^[\w./-]+\.(?:html|js|json|css|svg|film)(?::\d+)?:\s*/, "").replace(/^[a-z]+(?=[\s,:]|$)/, w => w.charAt(0).toUpperCase() + w.slice(1)), where: m ? [m[1]] : [], evidence: [], why: "", fix: "", from: ["check"] }; };
  return (problems || []).map(s => one(s, "must")).concat((warnings || []).map(s => one(s, "should")));
}
const ln = s => String(s || "").replace(/[\u2013\u2014]/g, ",").replace(/\s+/g, " ").trim();
function devPrompt(o) {
  const all = mergeFindings(o.findings || []), must = all.filter(x => x.severity === "must"), should = all.filter(x => x.severity !== "must");
  const id = o.id || "my-app", name = o.name || id;
  const item = (x, i) => (i + 1) + ". " + ln(x.title) + (x.where && x.where.length ? " (" + x.where.slice(0, 3).join(", ") + ")" : "")
    + (x.evidence && x.evidence.length ? "\n   Found: " + x.evidence.slice(0, 3).map(ln).join("; ") : "")
    + (x.why ? "\n   Why it matters: " + ln(x.why) : "") + (x.fix ? "\n   Fix: " + ln(x.fix) : "");
  let t = "My Lamba TV app \"" + name + "\" (folder " + id + ")" + (o.ver ? ", version " + o.ver + "," : "") + " was reviewed by Lamba. "
    + (must.length ? "Fix these before it can be approved" : "It can be approved; these would make it better") + ". Read the code at each place named, make the change, and keep everything else as it is.\n";
  if (must.length) t += "\nMust fix:\n" + must.map(item).join("\n") + "\n";
  if (should.length) t += "\n" + (must.length ? "Also worth fixing:" : "Suggestions:") + "\n" + should.map(item).join("\n") + "\n";
  if (!all.length) t += "\nThe review found nothing to change.\n";
  t += "\nLamba's rules for screens are in the kit: docs DESIGN.md, UI.md and FILMS.md (https://lamba.tv/devs/docs/). When you are done, run node lamba-check.mjs " + id
    + " and node lamba-test.mjs " + id + " --perf, fix anything they find, then zip the " + id + " folder so I can upload it as a new version.";
  return t;
}

return { perfStatic, perfWarnings, measuredFindings, mergeFindings, checkFindings, devPrompt };
})();

// ---- tools/sdk_check.mjs ----
const M_files = (() => {
// The rules of `lamba check` (docs/sdk/README.md) on an app's files, with no reach into the disk, so the command line
// (tools/lamba_check.mjs, an app folder) and the worker (worker/check.js, an uploaded zip) check with the very same code.
//   import { checkFiles } from "./sdk_check.mjs";
//   checkFiles({ manifest, paths, text, sdk, acorn })   // -> [problems], [] when the app is ready
//     manifest  the parsed lamba.json (its own rules are tools/sdk_rules.mjs: the caller runs those first)
//     paths     every file in the app's folder, relative ("tv.html", "pictures/a.webp")
//     text(p)   the file's text, or null
//     sdk(p)    the text of a file of the SDK (p like "shell/sdk/lamba.js"), or null when it is not read (the worker
//               leaves Lamba's own SDK out: it is checked here, in this repo)
//     acorn     the acorn parser (reads scripts as Chrome 61 would), or null: then that rule says how to get it
// The rules, each with a plain sentence when something is wrong:
//   2. the screen page has no <video> or <audio> (films go through Lamba.film, sound through Web Audio)
//   3. every script the screen page runs (inline, its own files, the SDK) parses on Chrome 61, the oldest screen engine
//   4. the pages load only their own files, the SDK (shell/sdk/) and Google Fonts through Lamba (/fonts/, Lamba.fonts), and every page loads shell/sdk/lamba.js
//   5. phone pages never zoom (the viewport says user-scalable=no)
//   6. no address outside Lamba is reached unless lamba.json declares it in outside
//   7. no en or em dash anywhere people could read it (the app's pages, scripts and lamba.json)
//   9. Lamba.motion and Lamba.track (the phone's motion and camera) only on a phone page, and only when lamba.json declares "motion" or
//      "camera" in permissions; no getUserMedia or device motion events of its own (the host keeps the sensors: the picture never reaches the app).
//      Lamba.mic (the phone's microphone: level, words, record) only on a phone page and Lamba.voice (voice messages and live voice) only on
//      the screen page, both only with "microphone"; no speech recognition, recorder or microphone stream of its own. Warnings: listening that
//      never stops, words with no plan for a phone without speech to text, live voice in a kids app, and a listing that never says it listens
//      (micModes says which of the four the app uses, for the reviewer). Lamba.video (a live camera or screen shown on the screen) only on the
//      screen page and only with "video"; getDisplayMedia is the host's, never the app's
//  10. the Host's phone is the live screen on top and ONE row of tiles (settings, and the app's one tap actions from lamba.json
//      actions), nothing in between: no controller view, no controls for the Host in phone.html (see controllerRule)
//  13. every film the pages name (a string ending in .film) is in the folder; its smaller copies (name-720.film, name-360.film, which
//      shell/film.js asks for next to it) are a warning when they are missing, with the command that makes them (kit/lamba-film.mjs)
//  14. no emoji in what people read: the screen and phone pages, their scripts' words, lamba.json (pictures are SVG icons)
//  15. an app Players join has a player remote: phone.html in view "guest", the whole phone; it never asks for a name (Lamba's
//      join asks it once, for every app: Lamba.me()); warnings: a hold to act with no visible control, and sound with no sound control
//      for Players (a group with "players": true holding the volume or music settings)
//  16. phone pages use Lamba's controls (docs/sdk/UI.md): errors for their own Send/Undo/Reset, sound or music control, -/+ steppers,
//      number inputs; warnings for a heading or profile at the top, tabs, a grid of choice cards
//  17. warnings: how the screen runs on old screens (tools/sdk_perf.mjs perfStatic)
//  18. money (docs/sdk/MONETIZE.md): Lamba sells for every app. Refused: code that takes payments itself (Stripe, PayPal, the
//      browser's PaymentRequest or Apple Pay), card fields (card number, CVC, expiry), links out to other payment pages;
//      Lamba.buy on the screen page (the screen never sells), Lamba.buy of a product lamba.json does not list, or in an app with
//      nothing for sale. A kids app: a warning that Lamba sells there to the Host only, behind an extra confirm
//   8. the phone's controls are the shared ones: no <input type=range> or type=color of its own, no grid of colour dots or
//      swatches (a colours setting with swatches in lamba.json gets the drawer's colour strip and picker), no LambaUI.colours
const { inside, partKeys, PAY_HOSTS, paidOf, kidsOf } = M_rules;
const { perfStatic, perfWarnings } = M_perf;

// ---- the microphone: which of its four uses an app's code makes (the reviewer's "What to look at by hand", worker/check.js) ----
const MIC_MODES = [["level", "loudness", /\.\s*mic\s*\.\s*level\s*\(/], ["words", "words", /\.\s*mic\s*\.\s*words\s*\(/], ["record", "voice messages", /\.\s*mic\s*\.\s*record\s*\(|\.\s*voice\s*\.\s*play\s*\(|\.\s*voice\s*\.\s*on\s*\(\s*["']message/], ["live", "live voice", /\.\s*voice\s*\.\s*live\s*\(/]];
const stripCode = c => String(c || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
function micModes({ paths, text }) {
  const code = (paths || []).filter(p => /\.(html|js)$/i.test(p)).map(p => stripCode(text(p))).join("\n");
  return MIC_MODES.filter(m => m[2].test(code)).map(m => m[1]);
}

const TEXT = [".html", ".js", ".css", ".json", ".svg", ".md", ".txt"];
const ext = p => { const m = String(p).match(/\.[A-Za-z0-9]+$/); return m ? m[0].toLowerCase() : ""; };
// where a relative address leads, from a page in the app's folder: "a/b.js", or "@sdk/lamba.js" for the SDK
// (../../shell/sdk/ from the folder's top), or null when it leaves both
function where(from, ref) {
  const base = String(from).split("/").slice(0, -1), parts = ["apps", "<app>"].concat(base);   // a folder name no address can spell
  for (const x of ref.split(/[?#]/)[0].split("/")) { if (x === "" || x === ".") continue; if (x === "..") { if (!parts.length) return null; parts.pop(); } else parts.push(x); }
  if (parts[0] === "apps" && parts[1] === "<app>" && parts.length > 2) return parts.slice(2).join("/");
  if (parts[0] === "shell" && parts[1] === "sdk" && parts.length > 2) return "@sdk/" + parts.slice(2).join("/");
  return null;
}

// ---- rule 10: no controller view (the Host's phone is the live screen and one row of tiles) ----
const norm = t => String(t || "").toLowerCase().replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
// the controls of a page as written in its HTML: [{ label, where: "player" | "host" | "shared", hidden }]. "where" comes from the nearest
// enclosing element whose id or class says player/guest/visit (the players' view), part (a settings part in the drawer) or
// host/owner/controller/ctl (the host's)
const PART = /(^|[\s_-])parts?([\s_-]|$)/i;
function pageControls(html) {
  const body = String(html).replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ""), out = [], stack = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g; let m, last = null;
  const attr = (a, n) => { const x = a.match(new RegExp("\\b" + n + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i")); return x ? x[1] || x[2] || x[3] || "" : ""; };
  const place = () => { for (let i = stack.length - 1; i >= 0; i--) { const t = stack[i].tag; if (/guest|player|visit|seat/i.test(t)) return "player"; if (PART.test(t)) return "part"; if (/owner|host|controller|ctl/i.test(t)) return "host"; } return "shared"; };
  while ((m = re.exec(body))) {
    const close = m[1] === "/", tag = m[2].toLowerCase(), a = m[3] || "";
    if (close) { const i = stack.map(x => x.name).lastIndexOf(tag); if (i > -1) { const c = stack[i]; if (c.control) { c.control.label = norm(attr(c.a, "aria-label") + " " + attr(c.a, "title") + " " + body.slice(c.at, m.index)); } stack.length = i; } continue; }
    const idc = attr(a, "id") + " " + attr(a, "class"), role = attr(a, "role"), type = attr(a, "type").toLowerCase();
    const isInput = tag === "input" && /^(button|submit|checkbox|radio|range|color)$/.test(type);
    const isControl = tag === "button" || tag === "select" || isInput || /^(button|switch|radio|tab|slider)$/.test(role);
    let control = null;
    if (isControl) { control = { label: norm(attr(a, "aria-label") + " " + attr(a, "title") + " " + attr(a, "value")), where: place(), hidden: /\bhidden\b/.test(a) && !/hidden\s*=\s*["']false/.test(a) }; out.push(control); }
    if (!VOID.has(tag) && !/\/\s*$/.test(a)) stack.push({ name: tag, tag: idc, control, a, at: re.lastIndex });
  }
  return out;
}
// every name the host shows people as a tile or in one: a group's and a part's label, a setting's label and its choices' names
function settingNames(m) {
  const names = new Set(), add = t => { const n = norm(t); if (n.length >= 3 && !/^(the|and|set|new|ok)$/.test(n)) names.add(n); };
  const st = m.settings || {};
  for (const g of Array.isArray(st.groups) ? st.groups : []) if (g && !g.host) { add(g.label); for (const p of Array.isArray(g.parts) ? g.parts : []) if (p) add(p.label); }
  for (const f of Object.values(st.fields || {})) if (f && typeof f === "object") { add(f.label); add(f.name); add(f.title); for (const c of Array.isArray(f.choices) ? f.choices : []) if (c && typeof c === "object") add(c.name); }
  return names;
}
const SOUNDISH = /^(mute|unmute|sound|sound on|sound off|volume|music)$/;
const CTL_SAY = "The Host's phone is the live screen on top and one row of tiles, nothing in between: move them into lamba.json actions (one tap tiles: \"actions\": [{ \"key\", \"label\", \"icon\" }], heard on the screen with Lamba.on(\"action\", fn)) or settings.";
function controllerRule(o, say, scriptsOf, where) {
  const m = o.manifest || {}, p = (m.screens || {}).phone, html = p ? o.text(p) : null; if (typeof html !== "string") return;
  const own = scriptsOf(html).srcs.map(s => where(p, s)).filter(f => f && f.indexOf("@sdk/") !== 0 && o.paths.indexOf(f) > -1);
  const code = [scriptsOf(html).inline.join("\n"), ...own.map(f => o.text(f) || "")].join("\n").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
  const label = l => l.replace(/\s+/g, " ").trim(), pretty = l => l.charAt(0).toUpperCase() + l.slice(1);
  const names = settingNames(m), soundSetting = [...names, ...Object.keys((m.settings || {}).fields || {})].some(n => /sound|volume|music|mute/.test(n));
  // a page that still draws a controller view (Lamba.screen.view "controller"): the host no longer shows it
  const ctlView = /["']controller["']/.test(code) || /\bl-controller\b/.test(html + code);
  // controls the page marks as the Host's (an element whose id or class says host, owner, controller, ctl)
  const host = pageControls(html).filter(c => c.where === "host").map(c => label(c.label || "")).filter(Boolean);
  if (ctlView || host.length) {
    const named = [...new Set(host)].map(pretty);
    say(p + ": " + (ctlView ? "has a controller view (Lamba.screen.view \"controller\"), which the Host's phone no longer shows" : "has controls for the Host's phone") + (named.length ? " (" + named.join(", ") + ")" : "") + ". " + CTL_SAY);
    return;
  }
  // an app no Player joins and with no settings part of its own: nothing ever shows its phone page
  const joins = m.guests === true || ((m.players || {}).max > 0), parts = (((m.settings || {}).groups) || []).some(g => g && Array.isArray(g.parts) && g.parts.some(x => x && x.app));
  if (!joins && !parts && pageControls(html).some(c => c.label && !c.hidden)) say(p + ": nobody sees it (no Players join and no settings part shows it), yet it has controls. " + CTL_SAY);
  // a button named like a setting, anywhere but a Player's view: the setting is a tile already
  const bad = new Set();
  pageControls(html).filter(c => c.where === "part" ? false : c.where !== "player" && !joins).forEach(c => { const l = label(c.label || ""); if (l && (names.has(l) || (soundSetting && SOUNDISH.test(l)))) bad.add(pretty(l)); });
  if (bad.size) say(p + ": has buttons for settings (" + [...bad].join(", ") + "). Move " + [...bad].join(", ") + " into lamba.json settings; the host shows them as tiles.");
}

// ---- rule 14: no emoji in words people read (Lamba's apps draw pictures as SVG icons, never emoji or clip art) ----
const EMOJI = /(?![\u00a9\u00ae\u2122\u2194-\u2199\u21a9\u21aa])\p{Extended_Pictographic}|\u{FE0F}/u;
const EMOJI_SAY = "Use words, or an SVG icon from the app's folder: never emoji or clip art (design rules).";
const NOT_WORDS = new Set(["$schema", "id", "icon", "card", "tint", "screens", "outside", "permissions", "key", "setting", "host", "type", "default", "apply", "category", "categories", "age", "inside", "legacy", "frame", "remote", "app", "action"]);
function noEmoji(m, say, pages, text, scriptsOf, where, has) {
  const walk = (v, path) => {
    if (typeof v === "string") { const e = v.match(EMOJI); if (e) say("lamba.json " + path + ": has an emoji (" + e[0] + "). " + EMOJI_SAY); }
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, path + "[" + i + "]"));
    else if (v && typeof v === "object") for (const k of Object.keys(v)) if (!NOT_WORDS.has(k)) walk(v[k], path ? path + "." + k : k);
  };
  walk(m, "");
  const words = code => [...code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1").matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g)].map(x => x[2]).join(" ");
  for (const p of pages) {
    const html = text(p); if (html === null) continue;
    const { inline, srcs } = scriptsOf(html), own = srcs.map(s => where(p, s)).filter(f => f && f.indexOf("@sdk/") !== 0 && has.has(f));
    const body = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ")
      .replace(/&#x([0-9a-f]{1,6});/gi, (x, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch (e) { return " "; } }).replace(/&#(\d{1,7});/g, (x, d) => { try { return String.fromCodePoint(+d); } catch (e) { return " "; } });
    const all = body + " " + inline.map(words).join(" ") + " " + own.map(f => words(text(f) || "")).join(" "), e = all.match(EMOJI);
    if (e) say(p + ": the words people read have an emoji (" + e[0] + "). " + EMOJI_SAY);
  }
}

// ---- rule 15: the player remote ----
const HOLD_TO = /\b(press and hold|long[- ]press|hold|holding)\b[^<>"'.]{0,30}\b(to|for)\b[^<>"'.]{0,24}/i;
function playerRemote(m, say, warnings, text, scriptsOf, where, has) {
  const joins = m.guests === true || ((m.players || {}).max > 0); if (!joins) return;
  const p = (m.screens || {}).phone;
  if (!p) { if (m.guests !== true) say("players.max is above 0, so Players join: set guests to true and give them a player remote (screens.phone, view \"guest\")"); return; }
  if (m.guests !== true) say("players.max is above 0, so Players join: set guests to true (their player remote is " + p + ", view \"guest\")");
  const html = text(p); if (html === null) return;
  const { inline, srcs } = scriptsOf(html), own = srcs.map(s => where(p, s)).filter(f => f && f.indexOf("@sdk/") !== 0 && has.has(f));
  const code = [inline.join("\n"), ...own.map(f => text(f) || "")].join("\n");
  if (/screen\s*\.\s*view|\bview\s*===?/.test(code) && !/["']guest["']/.test(code)) say(p + ": Players join this app, so it needs a player remote: the page in view \"guest\" (Lamba.screen.view === \"guest\"), the whole phone, one main action");
  const ask = /<input\b[^>]*\b(placeholder|aria-label|name|id|autocomplete)\s*=\s*["'][^"']*\b(name|nickname|given-name)\b/i.test(html) || /\.(placeholder|autocomplete)\s*=\s*["'][^"']*\b(name|nickname|given-name)\b/i.test(code);
  // the remote must show what it can do: no hold-to-act with no visible control, and sound has a control Players can see
  const seen = html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ") + " " + [...code.matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g)].map(x => x[2]).join(" ");
  // a hold that IS a visible control is fine: a button (or role=button) of the remote that says hold or press, or that the code presses
  // and releases (pointerdown with pointerup or pointercancel, LambaUI.hold): a press and hold key, not an invisible gesture
  const keys = pageControls(html).filter(c => c.where !== "host" && !c.hidden);
  const holdKey = keys.some(c => /\b(hold|holding|press)\b/.test(c.label || "")) || (keys.length > 0 && (/LambaUI\s*\.\s*hold\s*\(/.test(code)
    || (/["']pointerdown["']/.test(code) && /["']pointer(up|cancel)["']/.test(code) && /setPointerCapture\s*\(/.test(code))));
  const hold = holdKey ? null : seen.match(HOLD_TO);
  if (hold) warnings.push(p + ": the remote says \"" + hold[0].trim() + "\": a hold to act, with no visible control. Put it on a button or a tile Players can see.");
  const S = m.settings || {}, F = S.fields || {}, SOUND = /sound|volume|music|mute|song|track/i;
  const hasSound = (m.permissions || []).includes("sound") || Object.keys(F).some(k => SOUND.test(k));
  if (hasSound) {
    const forPlayers = new Set((S.groups || []).filter(g => g && g.players === true).flatMap(g => (g.parts || []).flatMap(partKeys)));
    const tile = [...forPlayers].some(k => SOUND.test(k) || SOUND.test(String((F[k] || {}).name || "")));
    const button = pageControls(html).some(c => c.where !== "host" && !c.hidden && SOUNDISH.test(norm(c.label || "")));
    const built = (m.forPlayers || []).includes("sound");   // Lamba's own Sound tile (the screen's volume and mute), when the Host allows it
    if (!tile && !button && !built) warnings.push(p + ": the app has sound, but Players have no sound control. Add \"forPlayers\": [\"sound\"] to lamba.json.");
  }
  if (ask) say(p + ": asks the Player for a name. " + (m.askName === true ? "Lamba's join asks each Player's name once, for every app, before your page opens: use Lamba.me().name" : "Lamba asks it for you when lamba.json has \"askName\": true, and only then: use Lamba.me().name"));
}

// ---- askName: the name step is for apps that show names (a warning each way) ----
const READS_NAME = /\.\s*me\s*\(\s*\)|\b(?:players|visitors|list|who|p|pl|player)\s*(?:\[[^\]]*\]|\([^)]*\))?\s*\.\s*name\b/;
function askNameRule(m, warnings, pages, text, scriptsOf, where, has) {
  const joins = m.guests === true || ((m.players || {}).max > 0); if (!joins) return;
  let code = "";
  for (const p of pages) {
    const html = text(p); if (html === null) continue;
    const { inline, srcs } = scriptsOf(html), own = srcs.map(s => where(p, s)).filter(f => f && f.indexOf("@sdk/") !== 0 && has.has(f));
    code += "\n" + inline.join("\n") + "\n" + own.map(f => text(f) || "").join("\n");
  }
  code = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
  const reads = READS_NAME.test(code);
  if (m.askName === true && !reads) warnings.push("lamba.json: askName is true, but no page reads a Player's name (Lamba.me().name, the names in Lamba.players). Remove askName so Players go straight to the remote.");
  if (m.askName !== true && reads) warnings.push("lamba.json: a page reads a Player's name, but askName is not true, so the app sees \"Player 1\", \"Player 2\". Add \"askName\": true if the app shows names (a multiplayer game, scores, turns).");
}

// ---- rule 16: phone pages use Lamba's own controls (docs/sdk/UI.md, "Phone pages: use Lamba's controls") ----
// A phone page is only the live action (one big key). Settings live in lamba.json (the drawer: tiles, pictures, the dial), Send and
// Undo and Sound and Music are Lamba's. Errors: its own Send/Undo/Reset, its own sound/mute/volume/music control, steppers (-/+) and
// number or range inputs. Warnings: a heading or title or profile corner at the top, tabs, a grid of choice cards.
// Every sentence says "phone design:" (tools/sdk_rules.mjs fixHint and kit/lamba-test.mjs read that).
const PD = "phone design: ";
const SENDISH = /^(send( it| changes| now)?( to (the |my |your )?(screen|tv)s?)?|apply( changes)?|undo( changes| that)?|redo|reset( to (default|defaults|original))?|reset (all|settings|changes|everything))$/i;
const SOUNDISH_OWN = /^((un)?mute( (sound|music|audio|the screen))?|volume( up| down)?|(sound|music|audio) (on|off)|(sound|music|audio)|(turn|switch) (the )?(sound|music|audio) (on|off)|(play|pause|stop) music|next (song|track))$/i;
const DOWNISH = /^(\u2212|-|\u2013|minus|decrease|smaller|less|down)$/i, UPISH = /^(\+|plus|increase|larger|bigger|more|up)$/i;
const tokens = c => String(c || "").toLowerCase().split(/[\s]+/).filter(Boolean);
function phoneDesign(src, f, error, warn) {
  const code = String(src || "").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/<!--[\s\S]*?-->/g, " ");
  const els = [];
  for (const m of code.matchAll(/<(button|a|span|div|label|p|li|h[1-6]|input)\b([^>]*)>(?=([\s\S]*?)<\/\1>|)/gi)) {
    const attr = n => (m[2].match(new RegExp("\\b" + n + "\\s*=\\s*[\"']([^\"']*)[\"']", "i")) || [])[1] || "";
    const inner = (m[3] || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&minus;|&#8722;|&#x2212;/gi, "\u2212").replace(/&#43;|&plus;/gi, "+").replace(/&#45;/g, "-").replace(/\s+/g, " ").trim();
    const tag = m[1].toLowerCase(), type = attr("type").toLowerCase();
    els.push({ tag, type, dataop: attr("data-op"), id: attr("id").toLowerCase(), name: attr("name").toLowerCase(), cls: tokens(attr("class")), role: attr("role").toLowerCase(), aria: attr("aria-label"), pressed: attr("aria-pressed") || attr("aria-selected"), onclick: /\bonclick\b/i.test(m[2]), label: (inner || attr("aria-label") || attr("value") || attr("title")).trim(), at: m.index });
  }
  const clickable = e => e.tag === "button" || e.tag === "a" || e.role === "button" || e.onclick || /^(button|submit)$/.test(e.type);
  const seenMsg = new Set(), E = s => { if (!seenMsg.has(s)) { seenMsg.add(s); error(f + ": " + PD + s); } }, W = s => { if (!seenMsg.has(s)) { seenMsg.add(s); warn(f + ": " + PD + s); } };
  // errors: Lamba's Send and Undo are the bar's, Sound and Music are Lamba's tiles, numbers are Lamba's dial
  for (const e of els) {
    if (clickable(e) && SENDISH.test(e.label) && !(e.dataop || e.cls.some(c => /^l-act/.test(c)))) E("a \"" + e.label + "\" button of its own. Lamba shows Send and Undo; remove yours.");
    else if ((e.tag === "button" || e.tag === "input") && /^(send|undo|reset|apply)(-?(btn|button|changes))?$/.test(e.id || e.name)) E("a \"" + (e.id || e.name) + "\" button of its own. Lamba shows Send and Undo; remove yours.");
    if ((clickable(e) || e.tag === "span" || e.tag === "div") && SOUNDISH_OWN.test(e.label) && (clickable(e) || e.onclick)) E("a \"" + e.label + "\" control of its own. Use forPlayers sound / music: Lamba shows the Sound and Music tiles.");
    else if ((e.tag === "button" || e.tag === "input" || e.tag === "a") && /^(mute|unmute|volume|vol|(music|sound)-?(toggle|btn|button|slider|control))$/.test(e.id || e.name)) E("a \"" + (e.id || e.name) + "\" control of its own. Use forPlayers sound / music: Lamba shows the Sound and Music tiles.");
    if (e.tag === "input" && e.type === "number") E("an <input type=number>. Put it in lamba.json as a number setting: Lamba shows its dial.");
  }
  const labelOf = e => e.label.replace(/\s+/g, "");
  const down = els.filter(e => clickable(e) && DOWNISH.test(labelOf(e))), up = els.filter(e => clickable(e) && UPISH.test(labelOf(e)));
  if (down.length && up.length) E("a \u2212 and + pair of buttons for a setting. Put it in lamba.json as a number setting: Lamba shows its dial.");
  // steppers made in a script: "Increase"/"Decrease" labels, or a button whose text is set to "+" and "−"
  else if ((/["'`](increase|more)\b[^"'`]{0,40}["'`]/i.test(code) && /["'`](decrease|less)\b[^"'`]{0,40}["'`]/i.test(code) && /createElement\(\s*["']button["']\s*\)/.test(code)) || /textContent\s*=[^;]{0,60}["']\+["'][^;]{0,20}["'](−|-|\u2013)["']/.test(code)) E("a − and + pair of buttons for a setting. Put it in lamba.json as a number setting: Lamba shows its dial.");
  if (/\.stepUp\s*\(|\.stepDown\s*\(/.test(code)) E("a stepper (stepUp / stepDown) for a setting. Put it in lamba.json as a number setting: Lamba shows its dial.");
  // a picture picker of its own: for a photo that is a setting, Lamba shows the picker and the crop (a "photo" setting in lamba.json) and the app draws the address
  const ownPicker = /<input\b[^>]*\btype\s*=\s*["']?file\b[^>]*\baccept\s*=\s*["']?(image|\.(png|jpe?g|webp|heic))/i.test(code) || /<input\b[^>]*\baccept\s*=\s*["']?(image|\.(png|jpe?g|webp|heic))[^>]*\btype\s*=\s*["']?file\b/i.test(code)
    || (/createElement\(\s*["']input["']\s*\)/.test(code) && /\.type\s*=\s*["']file["']/.test(code) && /accept\s*=\s*["'`]\s*image|setAttribute\(\s*["']accept["']\s*,\s*["']image/.test(code));
  if (ownPicker) W("an <input type=file accept=image> of its own. If the photo is a setting (a picture in a frame, a slot), declare it in lamba.json as { \"type\": \"photo\", \"aspect\": \"4:3\" }: Lamba shows the picker and the crop and your app only draws the address in Lamba.settings. For a photo only your phone page reads, use LambaUI.photo.");
  // warnings: nothing at the top, no tabs, no wall of choices
  const body = code.replace(/^[\s\S]*?<body\b[^>]*>/i, "");
  const isL = e => e.cls.some(c => /^l-/.test(c));
  const head = els.find(e => (/^h[1-3]$/.test(e.tag) && !isL(e)) || (e.tag === "div" && e.cls.some(c => /^(app-?)?(title|heading|page-?title|topbar|top-?bar|app-?header|hero)$/.test(c)) && !isL(e)));
  const hdr = /<header\b(?![^>]*\bclass\s*=\s*["'][^"']*\bl-)/i.test(body);
  const corner = els.find(e => !isL(e) && e.cls.some(c => /^(profile|avatar|account|user-?name|player-?name|who|me|user-?chip|profile-?corner)$/.test(c)));
  const status = els.find(e => !isL(e) && /\b(you are up to date|up to date|connected to|last (updated|synced)|synced)\b/i.test(e.label));
  // Lamba's sheet, Send line, loader and calm selected states (docs/sdk/DESIGN.md checklist)
  const unsent = els.find(e => !isL(e) && /\b(not (yet )?(on|sent to) the screen( yet)?|not sent( yet)?|unsent changes?|changes? (not|waiting to be) sent)\b/i.test(e.label));
  if (unsent) E("a \"" + unsent.label.slice(0, 40) + "\" line of its own. Lamba's Send to screen shows inside the open setting while a change waits; remove yours.");
  const sheet = els.find(e => !isL(e) && e.cls.some(c => /^(drawer|bottom-?sheet|sheet|settings-?(drawer|sheet|panel)|drag-?handle|grabber|sheet-?handle)$/.test(c)));
  if (sheet) W("a drawer or sheet of its own (class \"" + sheet.cls.find(c => !/^l-/.test(c)) + "\"). Lamba draws the settings sheet, its handle and the connection dot; put settings in lamba.json.");
  const spin = els.find(e => !isL(e) && e.cls.some(c => /^(spinner|loader|loading-?spinner|spin)$/.test(c))) || /@(-webkit-)?keyframes\s+[\w-]*(spin|rotate|loader)[\w-]*\s*\{[^}]*rotate/i.test(code);
  if (spin) W("a spinner of its own. While something loads, use Lamba's dot orb (shell/orb.js, class lorb), never a spinner.");
  const DARK = /background(-color)?\s*:\s*(#000\b|#0{6}\b|black\b|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|#1[0-9a-f]1[0-9a-f]1[0-9a-f]\b|#111\b|#222\b)/i;
  for (const r of code.matchAll(/([^{}<>]+)\{([^{}]*)\}/g)) {
    const sel = r[1];
    if (/\.l-/.test(sel) || !/(\.(selected|active|is-active|is-selected|chosen|current|on)\b|\[aria-(pressed|selected|checked|current)\s*=\s*["']?(true|page))/i.test(sel) || !DARK.test(r[2])) continue;
    W("a solid black selected state (" + sel.trim().slice(0, 40) + "). Selected is calm: a light raised segment; only the one main action is dark."); break;
  }
  if (head || hdr) W("a heading or title at the top (" + (head ? "<" + head.tag + ">" : "<header>") + "). Nothing goes at the top: Lamba's own bar names the app and the Player.");
  if (corner) W("a profile or name corner (class \"" + corner.cls.find(c => !/^l-/.test(c)) + "\"). Lamba shows who you are; leave it out.");
  const ownHead = els.find(e => !isL(e) && (e.tag === "button" || e.tag === "a" || e.role === "button") && /^(done|back|leave|exit|easier to see|invite( a friend)?)$/i.test((e.label || "").trim()));
  const ownDot = els.find(e => !isL(e) && e.cls.some(c => /^(conn(ection)?-?(dot|light|lamp|status)|status-?dot|online-?dot|live-?dot)$/.test(c)));
  if (ownHead) W("a \"" + ownHead.label.trim().slice(0, 30) + "\" button of its own. Lamba draws the header, the same for the Host and every Player: the app's name with a small chevron (the details slide up from it: Share, Leave) and the connection dot at the top right. Never your own Back, Done, Leave, eye or Invite at the top.");
  if (ownDot) W("a connection dot of its own (class \"" + ownDot.cls.find(c => !/^l-/.test(c)) + "\"). Lamba draws it at the top right of the phone; leave it out.");
  if (status) W("a status line (\"" + status.label.slice(0, 40) + "\"). Lamba shows status; leave it out.");
  const tabby = els.some(e => e.role === "tablist" || e.role === "tab" || e.cls.some(c => /^(tabs?|tab-?(bar|row|list|strip)|tabbar)$/.test(c)));
  let run = false;   // a row of 3 or more buttons side by side, one of them marked as the current one: tabs
  for (const m of code.matchAll(/(?:<button\b[^>]*>[\s\S]*?<\/button>\s*){3,}/gi)) {
    const bs = [...m[0].matchAll(/<button\b([^>]*)>/gi)].map(b => b[1]);
    if (bs.some(a => /\baria-(selected|pressed|current)\s*=\s*["'](true|page)["']|\bclass\s*=\s*["'][^"']*\b(active|selected|current|on)\b/i.test(a)) && !bs.some(a => /\bl-(key|big)\b/.test(a))) run = true;
  }
  if (tabby || run) W("a row of tabs. A tile in Lamba's drawer opens one strip with a pill of parts; no tabs.");
  const cards = els.filter(e => !isL(e) && e.cls.some(c => /(^|-|_)(card|cards|choice|choices|thumb|swatch)$|^(card|choice|option|picture|pic)-?(card|item|tile)?$/.test(c)) && e.tag !== "p");
  const gridCss = /display\s*:\s*(inline-)?grid[^}]*grid-template-columns|grid-template-columns[^}]*display\s*:\s*grid/i.test(code) || /display\s*:\s*grid/i.test(code) && /grid-template-columns\s*:\s*(repeat|[^;]*\s[^;]*)/i.test(code);
  const imgs = (code.match(/<img\b/gi) || []).length;
  if (cards.length >= 3 || (gridCss && cards.length + imgs >= 4)) W("a grid of choice cards. Lamba's tile opens one strip of pictures; never show everything at once.");
}

const GOOGLE = /^https?:\/\/fonts\.(googleapis|gstatic)\.com/;

// ---- rule 11: a tile is never empty, and it says what is chosen ----
// The host draws the CHOSEN choice's picture when the choices have real pictures (an image or "live"), a number's value
// ("100%"), a switch or a position (choices left, centre, right...) as a small diagram of its state, a colour as its swatch;
// a group's icon only when none of these exists, else only a letter. So a group needs pictures on its choices, or its own
// icon; numbers, colours, switches and positions draw themselves. A line icon forced over choices that have real pictures
// hides what is chosen: a warning (shell/sdk/phone-host.js tilePic, docs/sdk/DESIGN.md "Tiles").
const PLACE_WORDS = /^(left|right|top|bottom|center|centre|middle|(top|bottom|upper|lower)[-_ ](left|right)|(left|right)[-_ ](top|bottom))$/i;
const realPic = pc => typeof pc === "string" && !!pc;
function groupPictures(m, say, warnings) {
  const S = m.settings; if (!S || !Array.isArray(S.groups) || !S.fields || typeof S.fields !== "object") return;
  S.groups.forEach(g => {
    if (!g || g.host !== undefined || !Array.isArray(g.parts)) return;
    const p = g.parts.find(x => x && x.setting), f = p && S.fields[p.setting], name = String(g.label || g.key || "this");
    const pics = f && f.type === "switch" ? [f.on, f.off] : f && (f.type === "choice" || f.type === "colour") && Array.isArray(f.choices) ? f.choices : null;
    const generic = g.icon !== undefined && g.icon !== "live" && !(g.icon && g.icon.choice);
    if (generic && g.parts.length === 1 && pics && pics.length && pics.every(c => c && realPic(c.picture)))
      warnings.push("settings.groups: the " + name + " group forces an icon although its choices have pictures. Leave out \"icon\": the tile shows the chosen picture, the way Lamba's own apps do.");
    if (g.icon !== undefined) return;
    if (f && (f.type === "number" || f.type === "colour" || f.type === "colours" || f.type === "switch")) return;
    if (f && f.type === "choice" && Array.isArray(f.choices) && f.choices.length > 1 && f.choices.every(c => c && (PLACE_WORDS.test(String(c.id)) || PLACE_WORDS.test(String(c.name))))) return;
    if (pics && pics.length && pics.every(c => c && c.picture !== undefined)) return;
    say("settings.groups: give the " + name + " group an icon (\"icon\": {\"icon\": \"pictures/" + String(g.key || "group") + ".svg\"}) or a picture for each choice: the host shows it on its tile.");
  });
}
// photo slots: several slots are the parts of ONE group (one tile "Photos", a pill "Left" "Right"), never one group each (warning)
function photoGroups(m, warnings) {
  const S = m.settings; if (!S || !Array.isArray(S.groups) || !S.fields || typeof S.fields !== "object") return;
  const only = S.groups.filter(g => g && g.host === undefined && Array.isArray(g.parts) && g.parts.length && g.parts.every(p => p && partKeys(p).length && partKeys(p).every(k => S.fields[k] && S.fields[k].type === "photo")));
  if (only.length > 1) warnings.push("settings.groups: " + only.map(g => "\"" + (g.label || g.key) + "\"").join(" and ") + " each hold only photo slots. Put every photo slot in ONE group (one \"Photos\" tile): one part with the slots side by side ({ \"label\": \"Photos\", \"photos\": [{ \"setting\": \"left\", \"label\": \"Left\" }, { \"setting\": \"right\", \"label\": \"Right\" }] }), or one part per slot (a pill to choose the slot), each with Lamba's crop.");
}
// the pill of parts and the tiles show a label at its own size and the row swipes: one or two short words (warning)
function shortLabels(m, warnings) {
  const S = m.settings; if (!S || !Array.isArray(S.groups)) return;
  const long = l => typeof l === "string" && (l.trim().length > 12 || l.trim().split(/\s+/).length > 2);
  S.groups.forEach(g => {
    if (!g || g.host !== undefined) return;
    if (long(g.label)) warnings.push("settings.groups: the group label \"" + g.label + "\" is long: " + LABEL_SAY);
    (Array.isArray(g.parts) ? g.parts : []).forEach(p => { if (p && long(p.label)) warnings.push("settings.groups: the part label \"" + p.label + "\" in " + (g.label || g.key || "a group") + " is long: " + LABEL_SAY); });
  });
}
const LABEL_SAY = "keep part and group labels to one or two short words (\"Photo 1\", not \"First picture\"; about 12 letters at most).";
// ---- rule 12: the word TV ----
const TV = { test: s => /(^|[^A-Za-z])TVs?(?![A-Za-z])/.test(String(s).replace(/Lamba TV/g, "Lamba")) };
const TV_SAY = "Say \"screen\" (or the screen's name), not \"TV\".";
// the people: the Host (whose screen it is) and Players (who join from their phones), never guest, visitor or owner
const ROLE = /\b(guests?|visitors?|owners?)\b/i;
const ROLE_SAY = "Call the people the Host and Players, not guests, visitors or owners.";
const NOT_TEXT = new Set(["$schema", "id", "icon", "card", "tint", "screens", "outside", "permissions", "picture", "key", "setting", "host", "type", "default", "apply", "category", "categories", "age", "inside", "legacy", "frame", "remote", "app"]);
function tvWord(m, say, warnings, pages, text, scriptsOf) {
  const walk = (v, path) => {
    if (typeof v === "string") { if (TV.test(v)) say("lamba.json " + path + ": " + TV_SAY); const r = v.match(ROLE); if (r) say("lamba.json " + path + " says \"" + r[0] + "\". " + ROLE_SAY); }
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, path + "[" + i + "]"));
    else if (v && typeof v === "object") for (const k of Object.keys(v)) if (!NOT_TEXT.has(k)) walk(v[k], path ? path + "." + k : k);
  };
  walk(m, "");
  for (const p of pages) {
    const html = text(p); if (html === null) continue;
    const { inline } = scriptsOf(html);
    const body = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ");
    let bad = TV.test(body);
    if (!bad) for (const code of inline) for (const s of code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1").matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) if (TV.test(s[2])) bad = true;
    if (bad) warnings.push(p + ": the words people read say \"TV\". " + TV_SAY);
    const role = body.match(ROLE);
    if (role) warnings.push(p + ": the words people read say \"" + role[0] + "\". " + ROLE_SAY);
  }
}

// ---- rule 13: films ----
// a film's files: name.film is required; name-720.film and name-360.film are the loader's quiet fallbacks (shell/film.js).
// Only a whole name in quotes is a film the page loads ("films/sea.film"): a piece of one, as in url.replace(".film", "-720.film"),
// "films/" + name + ".film" or `films/${name}.film`, is not checked (its name is only known when the page runs)
const FILM_NAME = /^[A-Za-z0-9_][A-Za-z0-9._-]*\.film$/;
function filmRefs(code) {
  const out = [];
  for (const r of code.matchAll(/(["'`])([^"'`\s]*\.film)(?:[?#][^"'`]*)?\1/g)) {
    const ref = r[2], name = ref.slice(ref.lastIndexOf("/") + 1);
    if (!FILM_NAME.test(name) || ref.indexOf("${") > -1) continue;   // ".film", "-720.film": a piece of a name
    const before = code.slice(Math.max(0, r.index - 40), r.index).replace(/\s+$/, ""), after = code.slice(r.index + r[0].length, r.index + r[0].length + 40).replace(/^\s+/, "");
    if (/\+$/.test(before) || /^\+/.test(after)) continue;   // "films/" + name + "-720.film": joined to other pieces
    out.push(ref);
  }
  return out;
}
function filmRule(m, has, text, say, warnings, where) {
  const seen = new Set();
  for (const f of [...has].filter(f => [".html", ".js"].includes(ext(f)))) {
    const code = (text(f) || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
    for (const ref of filmRefs(code)) {
      if (/^([a-z]+:|\/)/i.test(ref)) continue;
      const p = where(/\.html$/i.test(f) ? f : "index.html", ref); if (!p || seen.has(p)) continue; seen.add(p);
      const dir = p.indexOf("/") > -1 ? p.slice(0, p.lastIndexOf("/")) : ".", nm = p.slice(p.lastIndexOf("/") + 1).replace(/(-720|-360)?\.film$/, "");
      const cmd = "node lamba-film.mjs <your video> --name " + nm + " --out " + (m.id || "<app>") + "/" + dir;
      if (!has.has(p)) { say(f + ": loads the film \"" + ref + "\", but " + p + " is not in the app's folder. Fix: make it with `" + cmd + "` (it writes " + p.replace(/(-720|-360)?\.film$/, ".film") + " and its smaller copies), or correct the name in " + f + "."); continue; }
      if (/-(720|360)\.film$/.test(p)) continue;
      const lack = ["-720", "-360"].filter(v => !has.has(p.replace(/\.film$/, v + ".film")));
      if (lack.length) warnings.push(p + ": has no " + lack.map(v => p.replace(/\.film$/, v + ".film")).join(" or ") + ". It still plays, but " + [lack.includes("-720") ? "a screen that cannot play 1080 smoothly drops to the still picture" : "", lack.includes("-360") ? "the Host's phone preview has no film" : ""].filter(Boolean).join(", and ") + ". Fix: `" + cmd + "` makes every size.");
    }
  }
}

// ---- the icon (docs/sdk/ASSETS.md "Required: the icon"): warnings only, never a refusal ----
// A square mark with ONE clear subject in the middle 80%, simple at 48 px. What this can see in an SVG: it is not square; it is (or holds) a picture, a photo or a
// screenshot, that fills the square (so its subject touches the edges and the rounded corners cut it); a circle or a shape that fills the square edge to edge
// (a background shape is fine, the subject is not); a heavy file. A picture the size of the square is the usual case: "a raw crop of the screen".
const ICON_SAY = " Make an icon of one clear subject centred in the middle 80% of a square, simple enough to read at 48 px (https://lamba.tv/devs/docs/assets/#required-the-icon; node lamba-icon.mjs makes one from a picture).";
function iconRule(m, has, text, warnings) {
  const f = m.icon; if (typeof f !== "string" || !has.has(f) || !/\.svg$/i.test(f)) return;
  const svg = text(f); if (typeof svg !== "string") return;
  const vb = svg.match(/viewBox\s*=\s*["']\s*(-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i), W = vb ? +vb[3] : 0, H = vb ? +vb[4] : 0;
  const num = (tag, n) => { const x = tag.match(new RegExp("\\b" + n + "\\s*=\\s*[\"']\\s*(-?[\\d.]+)(%?)", "i")); return x ? { v: +x[1], pct: !!x[2] } : null; };
  if (W && H && Math.abs(W - H) > 0.02 * Math.max(W, H)) warnings.push(f + ": the icon is not square (viewBox " + W + " x " + H + "). Lamba shows it in a square tile and crops the rest." + ICON_SAY);
  const imgs = [...svg.matchAll(/<image\b[^>]*>/gi)].map(x => x[0]), bytes = svg.length;
  let full = false;
  for (const t of imgs) {
    const w = num(t, "width"), h = num(t, "height"), x = num(t, "x"), y = num(t, "y");
    const cw = w ? (w.pct ? w.v / 100 : W ? w.v / W : 1) : 1, ch = h ? (h.pct ? h.v / 100 : H ? h.v / H : 1) : 1;
    if (cw >= 0.9 && ch >= 0.9) full = true;
  }
  const raster = /data:image\/(png|jpe?g|webp|gif)/i.test(svg) || imgs.length > 0;
  if (full) warnings.push(f + ": the icon is a picture (a photo or a screenshot) that fills the whole square, so its subject touches the edges and the rounded corners cut it. At 48 px it is mud." + ICON_SAY);
  if (bytes > 20000) warnings.push(f + ": the icon is " + Math.round(bytes / 1024) + " KB" + (raster ? " (a picture inside it)" : "") + ". Keep it under 20 KB: one simple mark." + (raster && !full ? ICON_SAY : ""));
  // a shape that fills the square edge to edge is the background, so only a circle or a path as wide as the square (a subject at the edges) is meant here
  const circ = [...svg.matchAll(/<circle\b[^>]*>/gi)].map(x => x[0]).find(t => { const r = num(t, "r"); return r && W && r.v * 2 >= 0.96 * W && !/fill\s*=\s*["']url\(/i.test(t); });
  if (circ && !full) warnings.push(f + ": a circle fills the whole icon edge to edge, so the rounded corners cut it. Keep the subject inside the middle 80%." + ICON_SAY);
}
function checkFiles(o) {
  const m = o.manifest || {}, P = [], say = s => P.push(s), acorn = o.acorn || null;
  const has = new Set(o.paths || []), text = p => (has.has(p) ? o.text(p) : null);
  const screens = m.screens || {};
  const pages = [...new Set(Object.values(screens).filter(p => typeof p === "string" && inside(p)))];
  const scriptsOf = html => {
    const inline = [], srcs = [];
    for (const s of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) { const src = (s[1].match(/\bsrc\s*=\s*["']([^"']+)["']/i) || [])[1]; if (src) srcs.push(src); else inline.push(s[2]); }
    return { inline, srcs };
  };
  const allowedRef = (from, ref) => {
    if (/^\/fonts\/(css2\?|gs\/s\/)/.test(ref)) return true;   // Google Fonts through Lamba's own address (Lamba.fonts, worker/fonts.js)
    if (/^(data:|#|mailto:)/.test(ref)) return true;
    if (/^[a-z]+:/i.test(ref) || ref.startsWith("//") || ref.startsWith("/")) return false;
    return where(from, ref) !== null;
  };
  for (const p of pages) {
    const html = text(p); if (html === null) continue;
    const { inline, srcs } = scriptsOf(html);
    const isTv = p === screens.tv || p === screens.picture;
    // 2. no video or audio on the screen page (and none made by its scripts)
    if (isTv) {
      if (/<(video|audio)\b/i.test(html)) say(p + ": has a <video> or <audio> element (a screen page never does: use Lamba.film and Web Audio)");
      const own = srcs.filter(s => allowedRef(p, s)).map(s => where(p, s)).filter(f => f && f.indexOf("@sdk/") !== 0 && has.has(f));
      [...inline, ...own.map(text)].forEach((code, i) => { if (/createElement\(\s*["'](video|audio)["']\s*\)|new\s+Audio\s*\(/.test(code)) say(p + ": a script makes a video or audio element (" + (i < inline.length ? "inline script " + (i + 1) : own[i - inline.length]) + ")"); });
      // 3. parses on Chrome 61
      if (!acorn) say("can't read scripts as Chrome 61 would: run npm install once (acorn)");
      else {
        const parse = (code, what) => { try { acorn.parse(code, { ecmaVersion: 2017, sourceType: "script", allowReturnOutsideFunction: false }); } catch (e) { say(p + ": " + what + " does not run on Chrome 61 (old screens): " + e.message); } };
        inline.forEach((c, i) => parse(c, "inline script " + (i + 1)));
        srcs.forEach(s => {
          const f = allowedRef(p, s) ? where(p, s) : null; if (!f) return;
          if (f.indexOf("@sdk/") === 0) { const t = o.sdk ? o.sdk("shell/sdk/" + f.slice(5)) : null; if (t !== null && t !== undefined) parse(t, "shell/sdk/" + f.slice(5)); }
          else if (has.has(f)) parse(text(f), "apps/" + (m.id || "app") + "/" + f);
        });
      }
    }
    // 4. only its own files, the SDK and Lamba's /fonts/ (never Google's address); lamba.js on every page
    for (const r of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) if (!allowedRef(p, r[1])) say(p + ": loads " + r[1] + (GOOGLE.test(r[1]) ? " straight from Google (fonts come through Lamba: use Lamba.fonts, or /fonts/css2?family=Name:wght@400 for a fixed font)" : " (only the app's own files, ../../shell/sdk/ and /fonts/ through Lamba.fonts)"));
    if (!srcs.some(s => /(^|\/)shell\/sdk\/lamba\.js$/.test(s))) say(p + ": does not load ../../shell/sdk/lamba.js");
    // 5. a phone page never zooms
    if (p === screens.phone) { const vp = (html.match(/<meta[^>]+name=["']viewport["'][^>]*>/i) || [""])[0]; if (!/user-scalable\s*=\s*no/.test(vp)) say(p + ": the viewport needs user-scalable=no (phone pages never zoom)"); }
  }
  // 6. outside addresses: any https?:// in the app's pages, scripts and styles that isn't declared (Google Fonts go through Lamba.fonts, never direct)
  const declared = Array.isArray(m.outside) ? m.outside : [];
  const fine = u => /^http:\/\/www\.w3\.org\//.test(u) || declared.some(d => u === d || u.startsWith(d + "/"));
  const texts = [...has].filter(f => TEXT.includes(ext(f)));
  for (const f of texts.filter(f => [".html", ".js", ".css"].includes(ext(f)))) {
    const code = (text(f) || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
    for (const u of code.matchAll(/\b(?:https?|wss?):\/\/[^\s"'`)<>]+/g)) if (!fine(u[0])) say(f + ": reaches " + u[0] + (GOOGLE.test(u[0]) ? " straight from Google (fonts come through Lamba: use Lamba.fonts)" : ", which lamba.json does not declare in outside"));
    if (/\bnew\s+WebSocket\s*\(|\bEventSource\s*\(|navigator\.sendBeacon/.test(code)) say(f + ": opens its own connection (talk to the screen and phones with Lamba.send)");
    if (/\b(localStorage|sessionStorage|indexedDB|document\.cookie)\b/.test(code)) say(f + ": uses the browser's storage, which a sealed app does not have (use Lamba.store)");
  }
  // 7. no en or em dash
  for (const f of texts) { const lines = (text(f) || "").split("\n"); lines.forEach((l, i) => { if (/[\u2013\u2014]/.test(l)) say(f + ":" + (i + 1) + ": an en or em dash (use a comma, a full stop, or rewrite it)"); }); }
  // 8. shared controls only: no home-made slider, colour box or colour grid in the phone's pages and scripts
  const phoneFiles = [...has].filter(f => [".html", ".js"].includes(ext(f)) && f !== screens.tv && !/^(shapes|templates)/.test(f.split("/").pop()));
  for (const f of phoneFiles) {
    const code = (text(f) || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
    if (/type\s*=\s*["']range["']|\.type\s*=\s*["']range["']|setAttribute\(\s*["']type["']\s*,\s*["']range["']/.test(code)) say(f + ": a home-made slider (<input type=range>): use a number setting, the drawer's shared dial");
    if (/type\s*=\s*["']color["']|\.type\s*=\s*["']color["']/.test(code)) say(f + ": a home-made colour box (type=color): use a colours or colour setting with swatches");
    if (/LambaUI\.colours\b/.test(code)) say(f + ": LambaUI.colours is gone: give the colours setting swatches in lamba.json and put it in a group part (the drawer draws the shared colour strip and picker)");
    if (/(className|class)\s*=\s*["'][^"']*\b(swatch|swatches|colou?r-?(grid|dots?|picker|chips?)|dots?-?grid)\b/i.test(code) || /classList\.add\(\s*["'][^"']*(swatch|colou?r-?(grid|dots?|picker))/i.test(code)) say(f + ": a home-made colour grid or picker: use a colours or colour setting with swatches (the drawer draws the shared strip and picker)");
  }
  const warningsLater = [];
  // 9. the phone's motion and camera: declared, on a phone page, and through Lamba (never the browser's own)
  const perms = Array.isArray(m.permissions) ? m.permissions : [], tvFiles = new Set([screens.tv, screens.picture].filter(Boolean));
  for (const t of [...tvFiles]) { const h = text(t); if (h !== null) scriptsOf(h).srcs.forEach(s => { const f = allowedRef(t, s) ? where(t, s) : null; if (f && f.indexOf("@sdk/") !== 0) tvFiles.add(f); }); }
  for (const f of [...has].filter(f => [".html", ".js"].includes(ext(f)))) {
    const code = (text(f) || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
    for (const [use, perm, name] of [[/\bLamba\s*\.\s*motion\b|\b[A-Za-z_$][\w$]*\s*\.\s*motion\s*\.\s*(start|stop|on|centre|center|state)\b/, "motion", "Lamba.motion"], [/\bLamba\s*\.\s*track\b|\b[A-Za-z_$][\w$]*\s*\.\s*track\s*\.\s*(start|preload|cameras)\b/, "camera", "Lamba.track"]]) {
      if (!use.test(code)) continue;
      if (!perms.includes(perm)) say(f + ": uses " + name + " but lamba.json permissions does not include \"" + perm + "\" (add it: the host asks the person)");
      if (tvFiles.has(f)) say(f + ": " + name + " is for the phone's pages (the screen has no " + (perm === "camera" ? "camera" : "motion sensors") + ")");
    }
    for (const [use, name, phone] of [[/\bLamba\s*\.\s*mic\b|\b[A-Za-z_$][\w$]*\s*\.\s*mic\s*\.\s*(level|words|record|stop)\s*\(/, "Lamba.mic", true], [/\bLamba\s*\.\s*voice\b|\b[A-Za-z_$][\w$]*\s*\.\s*voice\s*\.\s*(play|live)\s*\(/, "Lamba.voice", false]]) {
      if (!use.test(code)) continue;
      if (!perms.includes("microphone")) say(f + ": uses " + name + " but lamba.json permissions does not include \"microphone\" (add it: Lamba asks the person)");
      if (phone && tvFiles.has(f)) say(f + ": Lamba.mic is for the phone's pages (the screen has no microphone: it plays voice with Lamba.voice)");
      if (!phone && !tvFiles.has(f) && /\.\s*voice\s*\.\s*(play|live)\s*\(/.test(code)) say(f + ": Lamba.voice is for the screen page (the phone records with Lamba.mic.record; live voice is Lamba's own hold to talk)");
    }
    if (/\bLamba\s*\.\s*video\b|\b[A-Za-z_$][\w$]*\s*\.\s*video\s*\.\s*(live|place)\s*\(/.test(code)) {
      if (!perms.includes("video")) say(f + ": uses Lamba.video but lamba.json permissions does not include \"video\" (add it: Lamba shows the picture and asks the person)");
      if (!tvFiles.has(f)) say(f + ": Lamba.video is for the screen page (the phone's own Show my camera and Share my screen controls are Lamba's)");
    }
    if (/\bgetUserMedia\b|\bmediaDevices\b|\bgetDisplayMedia\b/.test(code)) say(f + ": opens the camera or microphone itself (use Lamba.track or Lamba.mic: the host asks the person and the picture or sound stays on the phone)");
    if (/\b(webkit)?SpeechRecognition\b|\bMediaRecorder\b|\bcreateMediaStreamSource\b/.test(code)) say(f + ": listens to the microphone itself (use Lamba.mic: words, loudness or a voice message, and Lamba asks the person first)");
    if (/["'](devicemotion|deviceorientation|deviceorientationabsolute)["']|\b(DeviceMotionEvent|DeviceOrientationEvent)\b/.test(code)) say(f + ": reads the phone's sensors itself (use Lamba.motion: the host asks the person and calms the readings)");
  }
  micWarnings(m, [...has].filter(f => [".html", ".js"].includes(ext(f))), text, w => warningsLater.push(w));
  // 10. the Host's phone: the live screen on top and one row of tiles; no controller view, no controls for the Host
  controllerRule({ manifest: m, paths: [...has], text }, say, scriptsOf, where);
  // 14. no emoji in what people read
  noEmoji(m, say, pages, text, scriptsOf, where, has);
  // 15. an app Players join has a player remote, and never asks for a name
  const warnings = warningsLater;
  playerRemote(m, say, warnings, text, scriptsOf, where, has);
  askNameRule(m, warnings, pages, text, scriptsOf, where, has);
  // 16. phone pages use Lamba's controls (docs/sdk/UI.md)
  for (const p of pages.filter(x => x !== screens.tv && x !== screens.picture)) {
    const html = text(p); if (html === null) continue;
    const { srcs } = scriptsOf(html), own = srcs.map(s => allowedRef(p, s) ? where(p, s) : null).filter(f => f && f.indexOf("@sdk/") !== 0 && has.has(f) && ext(f) === ".js");
    phoneDesign([html, ...own.map(f => text(f) || "")].join("\n"), p, say, w => warnings.push(w));
  }
  // 11. every group of the drawer has a picture on its tile: an icon, or a picture for each choice (the host shows it)
  groupPictures(m, say, warnings);
  photoGroups(m, warnings);
  shortLabels(m, warnings);
  // 12. "TV" is not what an app calls the screen: an error in the listing, a warning in the pages
  tvWord(m, say, warnings, pages, text, scriptsOf);
  filmRule(m, has, text, say, warnings, where);
  iconRule(m, has, text, warnings);
  // 17. how the screen runs on old screens (tools/sdk_perf.mjs): style or filter writes every frame, timers that redraw the
  //     scene, a film floor with no lighter copy, sound with no unlock. Warnings here; the review (docs/sdk/REVIEW.md) shows them as findings
  moneyRule(m, has, text, say, warnings, [...tvFiles]);
  const perf = acorn ? perfStatic({ manifest: m, paths: [...has], text, acorn }) : [];
  perfWarnings(perf).forEach(w => warnings.push(w));
  // 18. split screen: "split": "tall" gives the screen page a half's own tall shape, so it should read Lamba.layout (docs/sdk/DESIGN.md "Split screen")
  if (m.split === "tall" && typeof screens.tv === "string") {
    const html = text(screens.tv), { inline, srcs } = html === null ? { inline: [], srcs: [] } : scriptsOf(html);
    const code = inline.concat(srcs.map(s => allowedRef(screens.tv, s) ? where(screens.tv, s) : null).filter(f => f && has.has(f)).map(f => text(f) || "")).join("\n");
    if (html !== null && !/\blayout\b|onLayout/.test(code)) warnings.push(screens.tv + ": lamba.json says \"split\": \"tall\", but the screen page never reads Lamba.layout: in a half it gets half the width and the whole height. Lay it out for that (Lamba.onLayout), or leave \"split\" out and the host letterboxes the whole page");
  }
  P.warnings = warnings; P.perf = perf;
  return P;
}

// 18. money: only Lamba takes payments. Comments are left out first, so a note about it never trips the rule
const PAY_CODE = [
  [/\bStripe\s*\(|\bloadStripe\b|\bstripe\.(confirm|redirectToCheckout|elements)\b/i, "uses Stripe itself"],
  [/\bpaypal\s*\.\s*(Buttons|checkout)\b|\bpaypal-button\b/i, "uses PayPal itself"],
  [/\bnew\s+PaymentRequest\b|\bPaymentRequest\s*\(|\bApplePaySession\b|\bgoogle\.payments\b/, "takes a payment with the browser itself (PaymentRequest, Apple Pay or Google Pay)"],
  [/autocomplete\s*=\s*["']cc-(number|csc|exp|exp-month|exp-year|name)["']|\.autocomplete\s*=\s*["']cc-/i, "has a card field (autocomplete cc-...)"],
  [/\b(name|id|placeholder|aria-label)\s*=\s*["'][^"']*\b(card ?number|cardnumber|credit ?card|cvc|cvv|security code)\b/i, "has a card field (card number, CVC)"],
  [/\b(card number|credit card number|cvc code|cvv code)\b/i, "asks for card details"]
];
function moneyRule(m, has, text, say, warnings, tvFiles) {
  const code = f => (text(f) || "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
  const ids = new Set((Array.isArray(m.products) ? m.products : []).map(p => p && p.id).filter(Boolean)), selling = paidOf(m), tv = new Set(tvFiles);
  let buys = false;
  for (const f of [...has].filter(f => [".html", ".js"].includes(ext(f)))) {
    const c = code(f);
    for (const [re, what] of PAY_CODE) if (re.test(c)) say(f + ": " + what + ". Lamba sells for every app: declare price, subscription or products in lamba.json and call Lamba.buy on the Host's phone");
    for (const u of c.matchAll(/\b(?:https?:)?\/\/([a-z0-9.-]+\.[a-z]{2,})(?=[\/:"'`\s?#)]|$)/gi)) if (PAY_HOSTS.test(u[1])) say(f + ": links to " + u[1] + ", a payment page outside Lamba (Lamba sells for every app: Lamba.buy)");
    for (const b of c.matchAll(/\bLamba\s*\.\s*buy\s*\(\s*(?:(["'])([^"']*)\1)?/g)) {
      buys = true;
      if (tv.has(f)) say(f + ": calls Lamba.buy on the screen page. Only the Host buys, on their phone (call it from phone.html in the Host's view)");
      if (!selling) say(f + ": calls Lamba.buy but lamba.json sells nothing (add price, subscription or products)");
      else if (b[2] !== undefined && b[2] !== "" && b[2] !== "app" && !ids.has(b[2])) say(f + ": Lamba.buy(\"" + b[2] + "\") names a product lamba.json does not list in products");
    }
  }
  if (kidsOf(m) && (buys || selling)) warnings.push("a kids app: Lamba never offers a purchase to Players; only the Host buys, on their own phone, after an extra confirm. Keep paid parts away from children's turns (docs MONETIZE.md)");
}

// ---- the rules that apply to a piece of code on its own: a code example in the docs (tests/sdk-docs-lint.test.mjs) ----
// The same rules as checkFiles, for a snippet that is not a whole app: lang is "html", "js", "css", "svg", "json" or
// anything else (plain words: only the dash rule). declared is the list of outside addresses the example's own lamba.json
// declares. Returns sentences, [] when the example breaks none.
function snippetProblems(code, lang, declared) {
  const P = [], say = s => P.push(s), L = String(lang || "").toLowerCase();
  if (/[\u2013\u2014]/.test(code)) say("an en or em dash (rule 7: use a comma, a full stop, or rewrite it)");
  if (!["html", "js", "javascript", "css", "svg", "json"].includes(L)) return P;
  const body = L === "json" ? code : code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");
  const ok = (declared || []).slice();
  // rule 4 and 6: no Google Fonts address, no address outside Lamba that is not declared
  if (L !== "json") for (const u of body.matchAll(/\b(?:https?|wss?):\/\/[^\s"'`)<>]+/g)) {
    if (/^http:\/\/www\.w3\.org\//.test(u[0]) || ok.some(d => u[0] === d || u[0].startsWith(d + "/"))) continue;
    say("reaches " + u[0] + (GOOGLE.test(u[0]) ? " straight from Google (rule 4: fonts come through Lamba, /fonts/css2?family=Name or Lamba.fonts)" : ", which lamba.json does not declare in outside (rule 6)"));
  }
  if (/fonts\.(googleapis|gstatic)\.com/.test(code) && !P.some(p => /Google/.test(p))) say("mentions Google Fonts' own address (rule 4: use /fonts/css2?family=Name or Lamba.fonts)");
  // rule 12: "TV" in what people read (the text of the page, a string in a script, a value in lamba.json)
  const strings = [];
  if (L === "json") for (const s of code.matchAll(/:\s*"((?:\\.|[^"\\])*)"|[\[,]\s*"((?:\\.|[^"\\])*)"/g)) strings.push(s[1] !== undefined ? s[1] : s[2]);
  else {
    if (L === "html" || L === "svg") strings.push(body.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " "));
    const scripts = L === "html" ? [...body.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x => x[1]) : L === "js" || L === "javascript" ? [body] : [];
    for (const c of scripts) for (const s of c.matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) strings.push(s[2]);
  }
  if (strings.some(s => TV.test(s))) say("the words people read say \"TV\" (rule 12). " + TV_SAY);
  // rules 8 and 9: no home-made controls, no sensors or storage of its own, no own connection
  if (L === "html" || L === "js" || L === "javascript") {
    if (/type\s*=\s*["']range["']|\.type\s*=\s*["']range["']|setAttribute\(\s*["']type["']\s*,\s*["']range["']/.test(body)) say("a home-made slider (<input type=range>, rule 8): use a number setting");
    if (/type\s*=\s*["']color["']|\.type\s*=\s*["']color["']/.test(body)) say("a home-made colour box (type=color, rule 8): use a colours or colour setting");
    if (/LambaUI\.colours\b/.test(body)) say("LambaUI.colours is gone (rule 8): use a colours setting with swatches");
    if (/(className|class)\s*=\s*["'][^"']*\b(swatch|swatches|colou?r-?(grid|dots?|picker|chips?)|dots?-?grid)\b/i.test(body)) say("a home-made colour grid or picker (rule 8)");
    if (/\bgetUserMedia\b|\bmediaDevices\b|\bgetDisplayMedia\b/.test(body)) say("opens the camera or microphone itself (rule 9: use Lamba.track or Lamba.mic)");
    if (/\b(webkit)?SpeechRecognition\b|\bMediaRecorder\b|\bcreateMediaStreamSource\b/.test(body)) say("listens to the microphone itself (rule 9: use Lamba.mic)");
    if (/["'](devicemotion|deviceorientation|deviceorientationabsolute)["']|\b(DeviceMotionEvent|DeviceOrientationEvent)\b/.test(body)) say("reads the phone's sensors itself (rule 9: use Lamba.motion)");
    if (/\bnew\s+WebSocket\s*\(|\bEventSource\s*\(|navigator\.sendBeacon/.test(body)) say("opens its own connection (rule 6: use Lamba.send)");
    if (/\b(localStorage|sessionStorage|indexedDB|document\.cookie)\b/.test(body)) say("uses the browser's storage (rule 6: use Lamba.store)");
  }
  if (L === "html" && /<(video|audio)\b/i.test(body)) say("a <video> or <audio> element (rule 2: use Lamba.film and Web Audio)");
  if ((L === "html" || L === "js" || L === "javascript") && /createElement\(\s*["'](video|audio)["']\s*\)|new\s+Audio\s*\(/.test(body)) say("makes a video or audio element (rule 2)");
  return P;
}

// ---- rule 9's warnings for the microphone: the privacy patterns docs/sdk/DESIGN.md asks for ----
function micWarnings(m, files, text, warn) {
  const code = files.map(f => stripCode(text(f))).join("\n");
  if (!/\.\s*mic\s*\.|\.\s*voice\s*\.\s*(live|play)\s*\(/.test(code)) return;
  const modes = micModes({ paths: files, text });
  if ((/\.\s*mic\s*\.\s*(level|words)\s*\(/.test(code)) && !/\.\s*stop\s*\(/.test(code)) warn("the microphone: Lamba.mic.level or words never stops (call the session's stop() once the app no longer listens, so the phone's microphone goes off)");
  if (/\.\s*mic\s*\.\s*words\s*\(/.test(code) && !/canWords|["']none["']/.test(code)) warn("the microphone: words are not on every phone (Firefox has none, an iPhone needs Siri on): check Lamba.mic.canWords or the \"none\" state, and offer another way (buttons, Lamba.mic.record)");
  if (/\.\s*mic\s*\.\s*(level|words|record)\s*\(/.test(code) && !/\.\s*on\s*\(\s*["']state["']|\.\s*ready\s*\.\s*(then|catch)\b|\.\s*catch\s*\(|\.\s*record\s*\([^)]*\)\s*\.\s*then\s*\(\s*function\s*\([^)]*\)\s*\{[^}]*\}\s*,/.test(code)) warn("the microphone: the app never hears when the person says no (session.on(\"state\") or ready.catch): show what to do instead");
  const kids = m.category === "kids" || (Array.isArray(m.categories) && m.categories.includes("kids"));
  if (kids && modes.includes("live voice")) warn("the microphone: a kids app's Players talk live only once the Host turns it on (Players, Microphone): the app must work without it");
  const about = JSON.stringify([m.about, m.page && m.page.about, m.page && m.page.facts]).toLowerCase();
  if (!/microphone|\bmic\b|voice|listen|blow|speak|sing|say/.test(about)) warn("the microphone: the app's page never says it listens (page.about or page.facts: say what it hears and why, e.g. \"Blow on your phone to...\")");
}

return { MIC_MODES, micModes, pageControls, EMOJI, phoneDesign, filmRefs, checkFiles, snippetProblems };
})();

// ---- worker/zip.js ----
const M_zip = (() => {
// Reading a developer's zip in the worker (worker/check.js): no libraries, the browser's own DecompressionStream for
// deflate. Only what an app folder needs: stored and deflated files, no encryption, no zip64, no links. Every size is
// checked twice (what the zip says, then what really comes out), so a small zip that would grow huge is stopped early.
//   const { files, problems } = await unzip(bytes, { maxFiles, maxFile, maxTotal })
//   files: [{ path, bytes }] (folders left out); problems: plain sentences (empty when it read well)

const u16 = (d, o) => d[o] | (d[o + 1] << 8);
const u32 = (d, o) => (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0;
let CRC = null;
const crc32 = b => {
  if (!CRC) { CRC = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; } }
  let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
// deflate, never more than cap bytes out
async function inflate(data, cap) {
  const ds = new DecompressionStream("deflate-raw"), w = ds.writable.getWriter(), r = ds.readable.getReader();
  w.write(data).catch(() => {}); w.close().catch(() => {});
  const parts = []; let n = 0;
  for (;;) {
    const { value, done } = await r.read();
    if (done) break;
    n += value.length; if (n > cap) { r.cancel().catch(() => {}); return null; }
    parts.push(value);
  }
  const out = new Uint8Array(n); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

async function unzip(buf, lim) {
  const d = buf instanceof Uint8Array ? buf : new Uint8Array(buf), P = [], files = [];
  const L = Object.assign({ maxFiles: 300, maxFile: 8 * 1024 * 1024, maxTotal: 25 * 1024 * 1024 }, lim || {});
  // the end of the central directory: in the last 22 + 65535 bytes
  let e = -1; for (let i = d.length - 22; i >= Math.max(0, d.length - 22 - 65535); i--) if (u32(d, i) === 0x06054b50) { e = i; break; }
  if (e < 0) return { files, problems: ["this isn't a zip file (zip your app's folder and upload that)"] };
  const count = u16(d, e + 10), size = u32(d, e + 12), at = u32(d, e + 16);
  if (count === 0xffff || size === 0xffffffff || at === 0xffffffff) return { files, problems: ["the zip uses zip64, which is for very large zips: an app is at most 25 MB"] };
  if (u16(d, e + 4) !== 0 || u16(d, e + 6) !== 0) return { files, problems: ["the zip is split into parts: make one zip"] };
  if (at + size > e) return { files, problems: ["the zip is damaged (its list of files is cut short)"] };
  if (count > L.maxFiles + 50) return { files, problems: ["the zip has " + count + " files: an app has at most " + L.maxFiles] };
  let o = at, total = 0;
  for (let k = 0; k < count; k++) {
    if (o + 46 > d.length || u32(d, o) !== 0x02014b50) { P.push("the zip is damaged (its list of files does not read)"); break; }
    const flags = u16(d, o + 8), method = u16(d, o + 10), crc = u32(d, o + 16), csize = u32(d, o + 20), usize = u32(d, o + 24);
    const nl = u16(d, o + 28), xl = u16(d, o + 30), cl = u16(d, o + 32), ext = u32(d, o + 38), lo = u32(d, o + 42);
    const raw = d.subarray(o + 46, o + 46 + nl);
    o += 46 + nl + xl + cl;
    let name; try { name = new TextDecoder("utf-8", { fatal: true }).decode(raw); } catch (x) { P.push("a file's name is not plain text (rename it with letters, digits and dashes)"); continue; }
    if (name.endsWith("/")) continue;   // a folder
    const mode = (ext >>> 16) & 0o170000;
    if (mode === 0o120000) { P.push(name + ": a link to another file (zip the real files instead)"); continue; }
    if (flags & 1) { P.push(name + ": the file is locked with a password (zip it without one)"); continue; }
    if (method !== 0 && method !== 8) { P.push(name + ": packed in a way Lamba can't read (use your computer's normal zip)"); continue; }
    if (usize > L.maxFile) { P.push(name + ": " + mb(usize) + ", larger than " + mb(L.maxFile) + " (the most for one file)"); continue; }
    total += usize; if (total > L.maxTotal) { P.push("the app is larger than " + mb(L.maxTotal) + " when unpacked"); break; }
    if (lo + 30 > d.length || u32(d, lo) !== 0x04034b50) { P.push(name + ": damaged in the zip"); continue; }
    const start = lo + 30 + u16(d, lo + 26) + u16(d, lo + 28), data = d.subarray(start, start + csize);
    if (data.length !== csize) { P.push(name + ": cut short in the zip"); continue; }
    let bytes = method === 0 ? data : await inflate(data, L.maxFile).catch(() => null);
    if (!bytes) { P.push(name + ": damaged in the zip, or larger than it says"); continue; }
    if (bytes.length !== usize || crc32(bytes) !== crc) { P.push(name + ": damaged in the zip (its size or checksum is wrong)"); continue; }
    files.push({ path: name, bytes: method === 0 ? bytes.slice() : bytes });
  }
  if (files.length > L.maxFiles) P.push("the zip has " + files.length + " files: an app has at most " + L.maxFiles);
  return { files, problems: P };
}
const mb = n => (n >= 1024 * 1024 ? (Math.round(n / 1024 / 1024 * 10) / 10) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB");

const enc = new TextEncoder();
// ---- a stored zip of files sent as a list ----
function zipStored(files) {
  const parts = [], central = []; let at = 0;
  for (const f of files) {
    const name = enc.encode(f.path), d = f.bytes, c = crc32(d), h = new DataView(new ArrayBuffer(30)), e = new DataView(new ArrayBuffer(46));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x800, true); h.setUint32(14, c, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, name.length, true);
    e.setUint32(0, 0x02014b50, true); e.setUint16(4, 20, true); e.setUint16(6, 20, true); e.setUint16(8, 0x800, true); e.setUint32(16, c, true); e.setUint32(20, d.length, true); e.setUint32(24, d.length, true); e.setUint16(28, name.length, true); e.setUint32(42, at, true);
    parts.push(new Uint8Array(h.buffer), name, d); central.push(new Uint8Array(e.buffer), name); at += 30 + name.length + d.length;
  }
  const cdLen = central.reduce((n, x) => n + x.length, 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cdLen, true); end.setUint32(16, at, true);
  const all = parts.concat(central, [new Uint8Array(end.buffer)]), o = new Uint8Array(all.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of all) { o.set(x, i); i += x.length; }
  return o;
}

return { unzip, mb, zipStored };
})();

// ---- worker/check.js ----
const M_upload = (() => {
// The automatic check on every app a developer uploads (worker/studio.js, docs/sdk/REVIEW.md). The same rules as
// `lamba check` (tools/sdk_rules.mjs for lamba.json, tools/sdk_check.mjs for the pages and scripts), plus what an app
// from outside Lamba must also meet: a zip Lamba can read, safe file names and kinds, the size limits, its own id, and
// two clips for its page.
//   const r = await checkUpload(bytes, { app, reserved, taken })
//     app       the app's id when this is a new version of it (lamba.json must say the same), or "" for a new app
//     reserved  ids no outside app may use (Lamba's own apps)
//     taken     (id) -> true when another developer has that id
//     server    true on upload to Lamba (worker/studio.js): the starter's placeholder clips stop the version; without it
//               (the kit's lamba-check.mjs, the simulator) they are only a warning, the first of the notes
//   r: { manifest, files: [{ path, bytes, type, size }], problems: [sentences], notes: [what a reviewer should look at], size }
const acorn = M_acorn;
const { checkRules, ID } = M_rules;
const { checkFiles, micModes } = M_files;
const { unzip, mb } = M_zip;

const LIMITS = { zip: 25 * 1024 * 1024, total: 25 * 1024 * 1024, file: 8 * 1024 * 1024, files: 300, depth: 8, path: 120 };
// the kinds of file an app may hold, and how each is served (worker/studio.js)
const TYPES = {
  html: "text/html; charset=utf-8", js: "text/javascript; charset=utf-8", css: "text/css; charset=utf-8", json: "application/json; charset=utf-8",
  txt: "text/plain; charset=utf-8", md: "text/plain; charset=utf-8", svg: "image/svg+xml", png: "image/png", webp: "image/webp", jpg: "image/jpeg",
  jpeg: "image/jpeg", gif: "image/gif", mp4: "video/mp4", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
  mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav", m4a: "audio/mp4", film: "application/octet-stream",
  jpgs: "application/octet-stream"   // a film's pictures for weak screens (name.seq.<k>.jpgs, made by lamba-film.mjs --seq)
};
// the starter kit's placeholder clips (kit/starter/my-app/clips, made by tools/sdk_kit_clips.py), by their SHA-256: a
// version may not be listed with them. If that tool makes them again, put the new hashes here (shasum -a 256 ...)
const PLACEHOLDER_CLIPS = ["5bbbd22bc3f4b056ee767a62b8ec885c6766ba38d5e57b72da4918b33e459ce0", "da6fe1d5a1acee53eb96995e6e9fd43f7a7e3f0de7ecbf6d0ed3627338e33287",
  "13dc9b09054f1df551795c2eedb74307376ac0b115a174710f497c9a9cab69f2", "f58064faa1a5f2806878f48c785d194532ac89c824b04feec76673bf8d65ef05"];
const sha256 = async b => [...new Uint8Array(await crypto.subtle.digest("SHA-256", b))].map(x => x.toString(16).padStart(2, "0")).join("");
const SEG = /^[A-Za-z0-9_][A-Za-z0-9._-]{0,79}$/;
const typeOf = p => { const x = String(p).match(/\.([A-Za-z0-9]+)$/); return x ? TYPES[x[1].toLowerCase()] || null : null; };
const SKIP = p => /(^|\/)__MACOSX\//.test(p) || /(^|\/)\.DS_Store$/.test(p) || /(^|\/)Thumbs\.db$/i.test(p);   // what a computer adds to a zip by itself

// a file's place in the folder: plain names, inside the folder, nothing hidden
function pathProblem(p) {
  if (/[\u0000-\u001f\\]/.test(p)) return p.replace(/[\u0000-\u001f]/g, "?") + ": a file name with a backslash or a control character";
  if (p.startsWith("/") || /^[A-Za-z]:/.test(p)) return p + ": a file name that starts at the top of a disk (zip the folder's contents instead)";
  const parts = p.split("/");
  if (parts.some(x => x === ".." || x === ".")) return p + ": a file name that leaves the app's folder (.. or .)";
  if (parts.some(x => x.startsWith("."))) return p + ": a hidden file (its name starts with a dot): leave it out of the zip";
  if (parts.some(x => !SEG.test(x))) return p + ": file names may use letters, digits, dots, dashes and underscores only";
  if (p.length > LIMITS.path || parts.length > LIMITS.depth) return p + ": the name is too long or too deep in folders";
  if (!typeOf(p)) return p + ": this kind of file can't be in an app (pages, scripts, styles, pictures, fonts, sounds, clips and .film only)";
  return null;
}

async function checkUpload(bytes, o) {
  const opt = o || {}, P = [], notes = [], say = s => P.push(s);
  let warn = "";
  const out = () => ({ manifest, files, problems: [...new Set(P)], notes, size: files.reduce((n, f) => n + f.size, 0) });
  let manifest = null, files = [];
  if (!bytes || bytes.byteLength === 0) { say("the upload was empty: choose your app's zip"); return out(); }
  if (bytes.byteLength > LIMITS.zip) { say("the zip is " + mb(bytes.byteLength) + ": an app is at most " + mb(LIMITS.zip)); return out(); }
  const z = await unzip(bytes, { maxFiles: LIMITS.files, maxFile: LIMITS.file, maxTotal: LIMITS.total });
  z.problems.forEach(say);
  let list = z.files.filter(f => !SKIP(f.path));
  // a zip of the folder itself (hello/lamba.json): its contents are the app
  if (!list.some(f => f.path === "lamba.json")) {
    const top = list.length && list[0].path.split("/")[0];
    if (top && list.every(f => f.path.startsWith(top + "/"))) list = list.map(f => ({ path: f.path.slice(top.length + 1), bytes: f.bytes }));
  }
  // a kit's zip (starter.zip, an example: lamba-hello/ with the app in hello/ and the AI helpers .agents/, .claude/ beside it):
  // the one folder that has a lamba.json is the app, the files around it are the workspace and are not uploaded
  if (!list.some(f => f.path === "lamba.json")) {
    const apps = [...new Set(list.filter(f => /^[^/]+\/lamba\.json$/.test(f.path)).map(f => f.path.split("/")[0]))];
    if (apps.length === 1) list = list.filter(f => f.path.startsWith(apps[0] + "/")).map(f => ({ path: f.path.slice(apps[0].length + 1), bytes: f.bytes }));
  }
  const seen = new Set();
  for (const f of list) {
    const bad = pathProblem(f.path); if (bad) { say(bad); continue; }
    const k = f.path.toLowerCase(); if (seen.has(k)) { say(f.path + ": in the zip twice (names differ only in capitals)"); continue; }
    seen.add(k); files.push({ path: f.path, bytes: f.bytes, type: typeOf(f.path), size: f.bytes.length });
  }
  const byPath = new Map(files.map(f => [f.path, f])), dec = new TextDecoder();
  const text = p => { const f = byPath.get(p); if (!f || !/^(text\/|application\/json|image\/svg)/.test(f.type)) return null; if (f.text === undefined) f.text = dec.decode(f.bytes); return f.text; };
  // 1. lamba.json, by the same rules as lamba check
  if (!byPath.has("lamba.json")) { say("no lamba.json at the top of the zip (zip the app's folder, with lamba.json in it)"); return out(); }
  try { manifest = JSON.parse(text("lamba.json")); } catch (e) { say("lamba.json is not valid JSON: " + e.message); return out(); }
  checkRules(manifest, { has: p => byPath.has(p) }).forEach(say);
  const m = manifest && typeof manifest === "object" ? manifest : {};
  // what an app from outside Lamba must also meet
  if (ID.test(m.id || "")) {
    if (opt.app && m.id !== opt.app) say("lamba.json says id " + m.id + ", but this is " + opt.app + " (an update keeps the app's id)");
    else if (!opt.app && (opt.reserved || []).includes(m.id)) say("the id " + m.id + " belongs to one of Lamba's own apps: choose another");
    else if (!opt.app && opt.taken && opt.taken(m.id)) say("the id " + m.id + " is already taken by another developer: choose another");
  }
  if (!Array.isArray(m.clips) || m.clips.length < 2) say("clips: at least 2 [file, caption] (design rules: Clips, node lamba-clips.mjs)");
  if (Array.isArray(m.clips)) {   // real clips of the app, not the starter's placeholders
    const clipFiles = files.filter(f => /^clips\//.test(f.path) && /\.(mp4|webp)$/i.test(f.path));
    let placeholder = false; for (const f of clipFiles) if (PLACEHOLDER_CLIPS.includes(await sha256(f.bytes))) { placeholder = true; break; }
    // on upload to Lamba it stops the version; the kit's own check and the simulator only warn (the starter has them)
    if (placeholder) { if (opt.server) say("Replace the starter's placeholder clips with clips of your own app."); else warn = "Replace the starter's placeholder clips with clips of your own app before you upload."; }
  }
  if (m.stagingOnly !== undefined) say("stagingOnly: leave it out (an app from outside Lamba is listed once it is approved)");
  if (m.listed === false) say("listed: leave it out (an approved app is listed for everyone)");
  if (m.notInDemo !== undefined) say("notInDemo: leave it out (only Lamba's own apps choose this)");
  if (m.position !== undefined) say("position: leave it out (only Lamba's own apps choose this)");
  if (m.legacy !== undefined) say("legacy: only for Lamba's own apps from before the SDK, leave it out");
  // 2 to 7: the pages and scripts, as lamba check reads them (Lamba's own SDK is checked in Lamba's repo, not here)
  const fr = checkFiles({ manifest: m, paths: files.map(f => f.path), text, sdk: null, acorn }); fr.forEach(say); (fr.warnings || []).forEach(w => notes.push(w));
  // what the reviewer reads by hand (docs/sdk/REVIEW.md)
  if (warn) notes.push(warn);   // first, so the kit's check and the simulator show it on top
  notes.push("Age: " + (m.age === "all" ? "all ages" : m.age || "not given"));
  notes.push((m.permissions || []).length ? "Asks for: " + m.permissions.join(", ") : "Asks for nothing (no sound, camera, motion, microphone or country)");
  if ((m.permissions || []).includes("microphone")) { const mm = micModes({ paths: files.map(f => f.path), text }); notes.push("Microphone: " + (mm.length ? mm.join(", ") : "declared, but no use found")); }
  if ((m.permissions || []).includes("video")) notes.push("Video: shows a live camera or screen picture on the screen, only after a person taps Lamba's own button" + ((m.category === "kids" || (m.categories || []).includes("kids")) ? " (a kids app: Players' video is off until the Host turns it on)" : ""));
  notes.push((m.outside || []).length ? "Reaches outside Lamba: " + m.outside.join(", ") : "Reaches no address outside Lamba");
  notes.push(m.guests ? "Players join with their phones: up to " + ((m.players || {}).max || 0) + " at once" : "No players: the Host's phone only");
  notes.push(files.length + " files, " + mb(files.reduce((n, f) => n + f.size, 0)));
  return out();
}

return { LIMITS, TYPES, PLACEHOLDER_CLIPS, typeOf, checkUpload };
})();
// A newer kit? One quick request to /devs/kit/version.json, at most once an hour (.lamba/kit-seen.json), silent when
// offline. LAMBA_NO_KIT_CHECK=1 turns it off.
async function kitNotice(base) {
  if (process.env.LAMBA_NO_KIT_CHECK) return;
  try {
    const here = dirname(fileURLToPath(import.meta.url)), cache = join(here, ".lamba", "kit-seen.json");
    let mine = 0, seen = {};
    try { mine = Number(JSON.parse(readFileSync(join(here, "lamba-kit.json"), "utf8")).version) || 0; } catch (e) { return; }   // no lamba-kit.json: not a kit workspace
    try { seen = JSON.parse(readFileSync(cache, "utf8")); } catch (e) {}
    let latest = seen.base === base && Date.now() - seen.at < 3600000 ? Number(seen.latest) || 0 : 0;
    if (!latest) {
      const r = await fetch(base + "/devs/kit/version.json", { signal: AbortSignal.timeout(1500) });
      if (r.status !== 200) return;
      latest = Number((await r.json()).version) || 0;
      if (!latest) return;
      try { mkdirSync(dirname(cache), { recursive: true }); writeFileSync(cache, JSON.stringify({ base, at: Date.now(), latest })); } catch (e) {}
    }
    if (latest > mine) console.log("A newer Lamba SDK exists (1." + latest + ", you have " + (mine ? "1." + mine : "an older one") + "): run node lamba-update.mjs");
  } catch (e) {}
}

// ---------- the command ----------
// node lamba-check.mjs [folder ...]   with no folder: every folder here that has a lamba.json (or this one)
// Each folder is checked as Lamba's server checks the zip you upload: the same code (above), on the same files.
const RESERVED = ["admin","alarm","app","apps","aquarium","art","aura","balloons","bowling","cheetah","chess","clock","colour","countdown","developers","devs","draw","draw-along","fireplace","flip","gallery","graffiti","home","lamba","mini-golf","motion-lab","neon","now-playing","paper","photos","ping-pong","pool","quotes","registry","remote","sdk","sdk-candles","sdk-frames","sdk-hello","sdk-roommic","sdk-showme","shell","stopwatch","tictactoe","timers","tracking-lab","welcome","window","winter-window","write-along","x","youtube"];
const SKIP = n => n === "node_modules" || n.startsWith(".");   // .lamba/ (the key) is hidden, so never in a zip
const SECRET = p => /(^|\/)\.lamba(\/|$)/.test(p);   // hidden files and folders stay out of an app's zip
function walk(dir) {
  const out = [], hidden = [];
  const go = d => { for (const n of readdirSync(d)) { const f = join(d, n); if (SKIP(n)) { if (n !== ".DS_Store") hidden.push(relative(dir, f)); continue; } if (statSync(f).isDirectory()) go(f); else out.push(relative(dir, f).split(sep).join("/")); } };
  go(dir); return { paths: out.sort(), hidden };
}
// a plain zip (stored, no compression) of the folder in memory: what the server reads
function zipOf(dir, paths) {
  if (paths.some(SECRET)) throw new Error("the key folder .lamba/ must never go into an upload");
  const parts = [], central = []; let at = 0;
  const crcT = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  for (const p of paths) {
    const data = readFileSync(join(dir, p)), name = Buffer.from(p, "utf8"), c = crc(data);
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x800, 6); h.writeUInt32LE(c, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(name.length, 26);
    const e = Buffer.alloc(46); e.writeUInt32LE(0x02014b50, 0); e.writeUInt16LE(20, 4); e.writeUInt16LE(20, 6); e.writeUInt16LE(0x800, 8); e.writeUInt32LE(c, 16); e.writeUInt32LE(data.length, 20); e.writeUInt32LE(data.length, 24); e.writeUInt16LE(name.length, 28); e.writeUInt32LE(at, 42);
    parts.push(h, name, data); central.push(e, name); at += 30 + name.length + data.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(paths.length, 8); end.writeUInt16LE(paths.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(at, 16);
  return new Uint8Array(Buffer.concat(parts.concat([cd, end])));
}
// --upload: send the folder to Lamba as a new version, with a developer's key (LAMBA_KEY, made at lamba.tv/devs/keys)
// the site and the developer's key: LAMBA_URL, else the address of LAMBA_MCP_URL (staging), else lamba.tv; the key from
// LAMBA_KEY, else the file lamba-login.mjs saved (.lamba/key here, or next to the app's folder)
function lambaBase() {
  let base = (process.env.LAMBA_URL || "").replace(/\/+$/, "");
  if (!base && process.env.LAMBA_MCP_URL) { try { base = new URL(process.env.LAMBA_MCP_URL).origin; } catch (e) {} }
  return base || "https://lamba.tv";
}
function lambaKey(dir) {
  let key = process.env.LAMBA_KEY || "";
  if (!key) for (const f of [join(process.cwd(), ".lamba", "key"), join(dirname(resolve(dir || ".")), ".lamba", "key")]) { try { key = readFileSync(f, "utf8").trim(); break; } catch (e) {} }
  return /^lamba_[A-Za-z0-9]{40}$/.test(key) ? key : "";
}
const NOT_CONNECTED = "not connected to Lamba yet. Run node lamba-login.mjs and tap Allow (never paste a key into a chat)";
// --upload: send the folder to Lamba as a new version (--new "what's new" for an update; or whatsNew in lamba.json)
async function send(dir, bytes) {
  const base = lambaBase(), key = lambaKey(dir);
  if (!key) { console.log("  not uploaded: " + NOT_CONNECTED); return false; }
  let r, d = {};
  try { r = await fetch(base + "/devs/mcp/upload?new=" + encodeURIComponent(OPT.new || ""), { method: "POST", headers: { authorization: "Bearer " + key, "content-type": "application/zip" }, body: bytes }); d = await r.json().catch(() => ({})); }
  catch (e) { console.log("  not uploaded: Lamba can't be reached (" + e.message + ")"); return false; }
  if (!d.app || !d.ver) { console.log("  not uploaded (" + r.status + "): " + (d.say || (d.error && d.error.message) || (d.problems || []).join("; ") || "please try again")); return false; }
  console.log("  uploaded " + d.app + " version " + d.ver + ": " + (d.state === "ready" ? "it passed Lamba's check and is ready to submit for review" : "Lamba's check found " + (d.problems || []).length + " to fix"));
  (d.problems || []).forEach((p, i) => console.log("    " + p + (d.fixes && d.fixes[i] ? "\n      fix: " + d.fixes[i] : "")));
  if (d.whatsNew) console.log("  what's new: " + d.whatsNew);
  (d.notes || []).filter(n => /^No what's new/.test(n)).forEach(n => console.log("  note: " + n));
  console.log("  its page: " + d.page);
  return d.state === "ready";
}
// --preview: a private link to play the app (simulator, on a phone too), no version made, 15 days
async function preview(dir, bytes) {
  const base = lambaBase(), key = lambaKey(dir);
  if (!key) { console.log("  no link yet: " + NOT_CONNECTED); return false; }
  let r, d = {};
  try { r = await fetch(base + "/devs/mcp/preview", { method: "POST", headers: { authorization: "Bearer " + key, "content-type": "application/zip" }, body: bytes }); d = await r.json().catch(() => ({})); }
  catch (e) { console.log("  no link yet: Lamba can't be reached (" + e.message + ")"); return false; }
  if (!d.link) { console.log("  no link yet (" + r.status + "): " + (d.say || (d.problems || []).join("; ") || "please try again")); return false; }
  console.log("Play it: " + d.link);
  return true;
}
// --try <app> [--ver N] [--screen name]: the version on your own screens (7 days), through the same tool your AI uses
async function tryIt(app) {
  const key = lambaKey(); if (!key) { console.log("not tried: " + NOT_CONNECTED); return false; }
  const call = async args => {
    let r, d = {};
    try { r = await fetch(lambaBase() + "/devs/mcp", { method: "POST", headers: { authorization: "Bearer " + key, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "lamba_try", arguments: Object.assign({ app }, args, OPT.screen ? { screen: OPT.screen } : {}) } }) }); d = await r.json().catch(() => ({})); }
    catch (e) { console.log("not tried: Lamba can't be reached (" + e.message + ")"); return null; }
    if (!d.result) { console.log("not tried (" + r.status + "): " + ((d.error && d.error.message) || "please try again")); return null; }
    return d.result;
  };
  let res = await call(OPT.ver ? { ver: +OPT.ver } : {});
  if (res && !res.isError && !OPT.ver && res.structuredContent && res.structuredContent.ver) res = await call({ ver: res.structuredContent.ver });   // the newest that passed the check
  if (!res) return false;
  console.log(res.content.map(c => c.text).join("\n"));
  return !res.isError;
}
// --download <app> [--ver N] [--force]: the app's files, written to ./<app>/ (refuses a folder with anything in it)
async function download(app) {
  const key = lambaKey(); if (!key) { console.log("not downloaded: " + NOT_CONNECTED); return false; }
  const dir = resolve(app);
  if (existsSync(dir) && readdirSync(dir).length && !FORCE) { console.log("not downloaded: ./" + app + "/ already has files in it. Use another place, or add --force to replace them."); return false; }
  let r;
  try { r = await fetch(lambaBase() + "/devs/mcp/download?app=" + encodeURIComponent(app) + (OPT.ver ? "&ver=" + encodeURIComponent(OPT.ver) : ""), { method: "POST", headers: { authorization: "Bearer " + key } }); }
  catch (e) { console.log("not downloaded: Lamba can't be reached (" + e.message + ")"); return false; }
  if (r.status !== 200) { const d = await r.json().catch(() => ({})); console.log("not downloaded (" + r.status + "): " + (d.say || (d.error && d.error.message) || "please try again")); return false; }
  const un = await M_zip.unzip(new Uint8Array(await r.arrayBuffer()), { maxFiles: 400, maxTotal: 60 * 1024 * 1024, maxFile: 30 * 1024 * 1024 });
  for (const f of un.files) { const to = join(dir, f.path); mkdirSync(dirname(to), { recursive: true }); writeFileSync(to, f.bytes); }
  console.log("downloaded " + app + " version " + r.headers.get("x-lamba-version") + ": " + un.files.length + " files in ./" + app + "/");
  return true;
}
async function one(dir) {
  const { paths, hidden } = walk(dir);
  const bytes = zipOf(dir, paths);
  const r = await M_upload.checkUpload(bytes, { app: "", reserved: RESERVED });
  const m = r.manifest || {}, P = r.problems.slice();
  if (m.id && M_rules.ID.test(m.id) && basename(dir) !== m.id) P.unshift("id (" + m.id + ") must be the name of the app's folder (rename the folder or the id)");
  const name = (m.name ? m.name + " (" + basename(dir) + ")" : basename(dir));
  if (P.length) console.log("lamba check: " + name + " is not ready\n  " + P.join("\n  "));
  else console.log("lamba check: " + name + " is ready to upload: the same check Lamba's server runs found nothing to fix");
  if (hidden.length) console.log("  note: left out, as they would be from your zip: " + hidden.join(", "));
  if (!P.length) r.notes.forEach(n => console.log("  note: " + n));
  if (PREVIEW) { if (P.length) { console.log("  no link yet: fix the above first"); return false; } return preview(dir, bytes); }
  if (UPLOAD) { if (P.length) { console.log("  not uploaded: fix the above first"); return false; } return send(dir, bytes); }
  return P.length === 0;
}
const UPLOAD = process.argv.includes("--upload"), PREVIEW = process.argv.includes("--preview"), FORCE = process.argv.includes("--force");
// options that take a value: --new "what's new", --ver 3, --screen "Living room", --try app, --download app
const OPT = {}, args = [], argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (/^--(new|ver|screen|try|download)$/.test(a)) OPT[a.slice(2)] = argv[++i] || ""; else if (!a.startsWith("-")) args.push(a); }
await kitNotice(lambaBase());
if (OPT.try !== undefined) process.exit(await tryIt(OPT.try || args[0]) ? 0 : 1);
if (OPT.download !== undefined) process.exit(await download(OPT.download || args[0]) ? 0 : 1);
let dirs = args.map(a => resolve(a));
if (!dirs.length) {
  const here = process.cwd();
  dirs = existsSync(join(here, "lamba.json")) ? [here] : readdirSync(here).filter(n => !SKIP(n) && existsSync(join(here, n, "lamba.json"))).map(n => join(here, n));
  if (!dirs.length) { console.log("lamba check: no app here. Run it with your app's folder: node lamba-check.mjs my-app"); process.exit(1); }
}
let good = true;
for (const d of dirs) {
  if (!existsSync(d) || !statSync(d).isDirectory()) { console.log("lamba check: " + d + " is not a folder"); good = false; continue; }
  if (!(await one(d))) good = false;
}
process.exit(good ? 0 : 1);
