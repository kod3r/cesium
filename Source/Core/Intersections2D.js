/*global define*/
define([
    ], function() {
    "use strict";

    var Intersections2D = {};

    /**
     * @param {Number} threshold The threshold coordinate value at which to clip the triangle.
     * @param {Boolean} keepAbove true to keep the portion of the triangle above the threshold, or false
     *                            to keep the portion below.
     * @param {Number} u0 The coordinate of the first vertex in the triangle, in counter-clockwise order.
     * @param {Number} u1 The coordinate of the second vertex in the triangle, in counter-clockwise order.
     * @param {Number} u2 The coordinate of the third vertex in the triangle, in counter-clockwise order.
     * @param {Number[]} [result] The array into which to copy the result.  If this parameter is not supplied,
     *                            a new array is constructed and returned.
     * @returns {Number[]} The polygon that results after the clip, specified as a list of
     *                     vertices.  The vertices are specified in counter-clockwise order.
     *                     Each vertex is either an index from the existing list (identified as
     *                     a 0, 1, or 2) or -1 indicating a new vertex not in the original triangle.
     *                     For new vertices, the -1 is followed by three additional numbers: the
     *                     index of each of the two original vertices forming the line segment that
     *                     the new vertex lies on, and the fraction of the distance from the first
     *                     vertex to the second one.
     */
    Intersections2D.clipTriangleAtAxisAlignedThreshold = function(threshold, keepAbove, u0, u1, u2, result) {
        if (typeof result === 'undefined') {
            result = [];
        } else {
            result.length = 0;
        }

        var u0Behind, u1Behind, u2Behind;
        if (keepAbove) {
            u0Behind = u0 < threshold;
            u1Behind = u1 < threshold;
            u2Behind = u2 < threshold;
        } else {
            u0Behind = u0 > threshold;
            u1Behind = u1 > threshold;
            u2Behind = u2 > threshold;
        }

        var numBehind = u0Behind + u1Behind + u2Behind;

        var u01Ratio, u02Ratio, u12Ratio, u10Ratio, u20Ratio, u21Ratio;

        if (numBehind === 1) {
            if (u0Behind) {
                u01Ratio = (threshold - u0) / (u1 - u0);
                u02Ratio = (threshold - u0) / (u2 - u0);

                result.push(1);

                result.push(2);

                result.push(-1);
                result.push(0);
                result.push(2);
                result.push(u02Ratio);

                result.push(-1);
                result.push(0);
                result.push(1);
                result.push(u01Ratio);
            } else if (u1Behind) {
                u12Ratio = (threshold - u1) / (u2 - u1);
                u10Ratio = (threshold - u1) / (u0 - u1);

                result.push(2);

                result.push(0);

                result.push(-1);
                result.push(1);
                result.push(0);
                result.push(u10Ratio);

                result.push(-1);
                result.push(1);
                result.push(2);
                result.push(u12Ratio);
            } else if (u2Behind) {
                u20Ratio = (threshold - u2) / (u0 - u2);
                u21Ratio = (threshold - u2) / (u1 - u2);

                result.push(0);

                result.push(1);

                result.push(-1);
                result.push(2);
                result.push(1);
                result.push(u21Ratio);

                result.push(-1);
                result.push(2);
                result.push(0);
                result.push(u20Ratio);
            }
        } else if (numBehind === 2) {
            if (!u0Behind) {
                u10Ratio = (threshold - u1) / (u0 - u1);
                u20Ratio = (threshold - u2) / (u0 - u2);

                result.push(0);

                result.push(-1);
                result.push(1);
                result.push(0);
                result.push(u10Ratio);

                result.push(-1);
                result.push(2);
                result.push(0);
                result.push(u20Ratio);
            } else if (!u1Behind) {
                u21Ratio = (threshold - u2) / (u1 - u2);
                u01Ratio = (threshold - u0) / (u1 - u0);

                result.push(1);

                result.push(-1);
                result.push(2);
                result.push(1);
                result.push(u21Ratio);

                result.push(-1);
                result.push(0);
                result.push(1);
                result.push(u01Ratio);
            } else if (!u2Behind) {
                u02Ratio = (threshold - u0) / (u2 - u0);
                u12Ratio = (threshold - u1) / (u2 - u1);

                result.push(2);

                result.push(-1);
                result.push(0);
                result.push(2);
                result.push(u02Ratio);

                result.push(-1);
                result.push(1);
                result.push(2);
                result.push(u12Ratio);
            }
        } else if (numBehind === 3) {
            // Completely behind threshold
        } else {
            // Completely in front of threshold
            result.push(0);
            result.push(1);
            result.push(2);
        }

        return result;
    };


    return Intersections2D;
});