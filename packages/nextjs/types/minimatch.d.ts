declare module "minimatch" {
  function minimatch(path: string, pattern: string, options?: minimatch.IOptions): boolean;

  namespace minimatch {
    interface IOptions {
      debug?: boolean;
      nobrace?: boolean;
      noglobstar?: boolean;
      dot?: boolean;
      noext?: boolean;
      nocase?: boolean;
      nonull?: boolean;
      matchBase?: boolean;
      nocomment?: boolean;
      nonegate?: boolean;
      flipNegate?: boolean;
      partial?: boolean;
      allowWindowsEscape?: boolean;
    }

    interface IMinimatch {
      pattern: string;
      options: IOptions;
      set: string[][];
      regexp: RegExp | null;
      negate: boolean;
      comment: boolean;
      empty: boolean;
      makeRe: () => RegExp | false;
      match: (fname: string | readonly string[], partial?: boolean) => boolean;
    }

    function filter(
      pattern: string,
      options?: IOptions,
    ): (path: string, index?: number, list?: readonly string[]) => boolean;

    function match(list: readonly string[], pattern: string | readonly string[], options?: IOptions): string[];

    function braceExpand(pattern: string, options?: IOptions): string[];

    function escape(pattern: string): string;

    const Minimatch: {
      new (pattern: string, options?: IOptions): IMinimatch;
      prototype: IMinimatch;
    };
  }

  export = minimatch;
}
