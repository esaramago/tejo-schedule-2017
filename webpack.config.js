const path = require('path');

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: path.resolve(__dirname, 'app'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // get js files
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                ]
            }
        ]
    },
    devtool: "source-map" // create sourcemaps
}