import {registerAs} from "@nestjs/config";

export default registerAs("file", () => ({
    destination: 'C:\\Users\\RoYaL\\Documents\\nginx_static_root\\static\\1oflads\\',
    staticRoot: 'http://lads.localhost/static/1oflads/'
}));


