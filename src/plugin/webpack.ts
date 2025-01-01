import { Compiler, WebpackPluginInstance } from 'webpack';
import { dependencies } from '../module/constants';

interface BundleOptions {
    plugins?: string[];
    addons?: string[];
}

export class ExternalsPlugin implements WebpackPluginInstance {
    private plugins: string[];
    private addons: string[];

    constructor(options: BundleOptions = {}) {
        this.plugins = [...options.plugins || [], ...dependencies.plugins];
        this.addons = [...options.addons || [], ...dependencies.addons];
    }

    apply(compiler: Compiler): void {
        compiler.hooks.normalModuleFactory.tap('ExternalsPlugin', (nmf) => {
            nmf.hooks.afterResolve.tapAsync('ExternalsPlugin', (result: any, callback: Function) => {
                const request: string = result.request;

                if (this.plugins.includes(request) || this.addons.includes(request)) {
                    result.external = true;
                } else {
                    result.external = {
                        type: 'module',
                        module: request
                    };
                }

                callback(null, result);
            });
        });
    }
}