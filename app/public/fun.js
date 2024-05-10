function draw_pixel(canvasData, x, y, r, g, b, a=255) {
    const canvasWidth = canvasData.width;
    let index = (x + y * canvasWidth) * 4;
    
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function drawCircleOnImageData(imageData, centerX, centerY, radius, color, opacity=null) {
    const data = imageData.data;
    const {width, height} = imageData;

    // Convert color input to RGBA array [red, green, blue, alpha]
    const rgba = hexToRGBA(color);
    if (opacity != null) {
        rgba[3] = opacity;
    }

    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            if (x * x + y * y <= radius * radius) {
                const pixelX = centerX + x;
                const pixelY = centerY + y;

                if (pixelX >= 0 && pixelX < width && pixelY >= 0 && pixelY < height) {
                    const index = (pixelX + pixelY * width) * 4;
                    data[index] = rgba[0];     // Red
                    data[index + 1] = rgba[1]; // Green
                    data[index + 2] = rgba[2]; // Blue
                    data[index + 3] = rgba[3]; // Alpha
                }
            }
        }
    }

    return imageData;
}

function hexToRGBA(hex) {
    let r = 0, g = 0, b = 0, a = 255; // Default is opaque black

    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    } else if (hex.length === 9) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
        a = parseInt(hex[7] + hex[8], 16);
    }

    return [r, g, b, a];
}


function torus_point_position(R, r, angle_1, angle_2) {
    const dist_1 = R + r * Math.cos(angle_2);

    return nj.array([
        dist_1 * Math.cos(angle_1),
        dist_1 * Math.sin(angle_1),
        r * Math.sin(angle_2),
    ], dtype='float32')
}

// https://en.wikipedia.org/wiki/Rotation_matrix
function rotate(point3d, phi_1, phi_2) {
    // phi_1 - rotate along y
    // phi_2 - rotate along x
    const R_x = nj.array([
        [1.0, 0.0, 0.0],
        [0.0, Math.cos(phi_2), -Math.sin(phi_2)],
        [0.0, Math.sin(phi_2), Math.cos(phi_2)],
    ], dtype='float32');

    const R_y = nj.array([
        [Math.cos(phi_1), 0.0, Math.sin(phi_1)],
        [0.0, 1.0, 0.0],
        [-Math.sin(phi_1), 0.0, Math.cos(phi_1)],
    ], dtype='float32');
    const Rot = nj.dot(R_x, R_y);
    return nj.dot(Rot, point3d.reshape(-1, 1))
}

function draw_torus(ctx, canvasData, R, r, phi_1, phi_2, num_steps_1=30, num_steps_2=10) {
    const canvasWidth = canvasData.width;
    const canvasHeight = canvasData.height;

    const min_depth = -(R + r);
    const max_depth = (R + r);
    let add_angle_1 = 2 * Math.PI / num_steps_1;
    let add_angle_2 = 2 * Math.PI / num_steps_2;

    for(let angle_1 = 0.0; angle_1 < 2 * Math.PI; angle_1 += add_angle_1) {
        for(let angle_2 = 0.0; angle_2 < 2 * Math.PI; angle_2 += add_angle_2) {
            let curr_point = torus_point_position(R, r, angle_1, angle_2);
            curr_point = rotate(curr_point, phi_1, phi_2);
            curr_point = curr_point.flatten();
            curr_point.set(0, curr_point.get(0) + canvasWidth / 2);
            curr_point.set(1, curr_point.get(1) + canvasHeight / 2);
            const opacity = 255 * (curr_point.get(2) - min_depth) / (max_depth - min_depth);
            const radius = 3;

            draw_pixel(canvasData, Math.floor(curr_point.get(1)), Math.floor(curr_point.get(0)), 0, 0, 0, radius);
            drawCircleOnImageData(canvasData, Math.floor(curr_point.get(1)), Math.floor(curr_point.get(0)), Math.floor(radius), '#000000', Math.floor(opacity));
        }
    }
}

let phi_1 = 0.0;
let phi_2 = 0.0;

function draw() {
    phi_1 += 2 * Math.PI / 43;
    phi_2 += 2 * Math.PI / 95;

    const canvas = document.getElementById("image-canvas");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        draw_torus(ctx, canvasData, 100, 30, phi_1, phi_2);
        ctx.putImageData(canvasData, 0, 0);
    }
}

window.setInterval(() => {draw()}, 30);
// window.addEventListener("load", draw);
