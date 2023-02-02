const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/client/client-test.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        clean: true,
        filename: 'app.js',
       // path: path.resolve(__dirname, 'public/js'),
    },
    devServer: {
        port: 9000
    },
}
