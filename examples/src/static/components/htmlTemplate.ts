import {$, RootTemplate, Template, css} from 'whits';
import header from './header.js';
import footer from './footer.js';

export interface TemplateParams {
	title: string;
	pageId: string;
	pageTemplate: Template<TemplateParams>;
}

export default new RootTemplate<TemplateParams>((params) => [
	$.head([
		$.meta({name: 'viewport', content: 'width=device-width, initial-scale=1'}),
		$.title(params.title),
		css`
			html, body {
				width: 100%;
				height: 100%;
				margin: 0;
			}
			html {
				font-size: 16px;
				font-family: sans-serif;
			}
			header {
				background-color: #333;
				color: #fff;
				padding: 1rem;
			}
			nav {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
			}
			nav > ul {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-end;
				list-style: none;
				padding: 0;
				margin: 0;
			}
			nav > ul > li {
				margin: 0 0.5rem;
			}
			nav > ul > li > a {
				color: #fcc;
				text-decoration: none;
			}
			nav > ul > li > a:hover {
				color: #fff;
			}
			main {
				padding: 1rem;
			}
		`
	]),
	$.body({id: `page-${params.pageId}`}, [
		header.render(params),
		$.main([
			params.pageTemplate.render(params)
		]),
		footer.render()
	])
]);
