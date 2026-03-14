import { parse, HTMLElement } from "node-html-parser";

function fix_src(root: HTMLElement, tag_name: string) {
    const nodes = root.querySelectorAll(tag_name);

    nodes.forEach((node) => {
        const src = node.getAttribute('src');

        if (src) {
            node.setAttribute('data-src', src);
            node.removeAttribute('src');
            node.classList.add('lazyload');
        }
    });
}

export function fix_content(content: string): string {
    const root = parse(content);

    fix_src(root, "img");
    fix_src(root, "video");

    return root.toString();
}
