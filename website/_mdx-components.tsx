import {
  Video,
  CodeSandbox,
  Gfycat,
  LinkPreview,
  StackBlitz,
  Tweet, TagList, Image, Newsletter, BlogCardList,
} from '@components';
import { Callout, Giscus, Steps } from '@theguild/components';
import { useMDXComponents as getDocsMDXComponents } from '@theguild/components/server';
import { Authors } from './app/_components/article';
import { getAllBlogs } from './lib/all-blogs';

const { wrapper: Wrapper, h1: H1, ...docsComponents } = getDocsMDXComponents({
  Callout,
  Steps,
  Tweet,
  Video,
  LinkPreview,
  CodeSandbox,
  Gfycat,
  StackBlitz,
});

const MyWrapper: typeof Wrapper = async ({ children, ...props }) => {
  const { filePath, tags, title, image } = props.metadata;
  const allBlogs = await getAllBlogs();
  const route = filePath.replace(/(^app|\/page\.mdx$)/g, '');
  if (!route.startsWith('/blog/')) {
    return <Wrapper {...props}>{children}</Wrapper>;
  }
  const similarArticles = allBlogs
    .filter(
      article =>
        (article.link !== route && tags.length === 0) ||
        article.tags?.some(tag => tags.includes(tag)),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (<Wrapper {...props}>
    <H1>{title}</H1>
    <Authors meta={props.metadata} />
    <TagList tags={tags} className='mt-4' />
    <Image src={image} className='mx-auto mt-6 aspect-video object-contain' />
    {children}
    <Giscus
      // ensure giscus is reloaded when client side route is changed
      // key={route}
      repo='the-guild-org/website'
      repoId='MDEwOlJlcG9zaXRvcnkxOTk3MTM1NzI='
      category='Docs Discussions'
      categoryId='DIC_kwDOC-djJM4CSZk-'
      mapping='pathname'
    />
    <Newsletter className='mt-6 flex-col !gap-10' />
    {similarArticles.length > 0 && (
      <>
        <h3 className='text-center text-[28px] font-extrabold dark:text-[#FCFCFC]'>
          Similar articles
        </h3>
        <BlogCardList articles={similarArticles} className='!grid-cols-2' />
      </>
    )}
  </Wrapper>);
};

export const useMDXComponents = components => {
  return {
    wrapper: MyWrapper,
    h1: H1,
    ...docsComponents,
    ...components,
  };
};