import Link from 'next/link'

const blogPosts = [
  {
    slug: 'test-mdx',
    title: 'Test MDX Blog Post',
    description: 'A test blog post using MDX with custom cursor component examples',
    date: '2025-10-01'
  }
]

export default function BlogPage() {
  return (
    <div className="container pt-18 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <Link
              href={`/blog/${post.slug}`}
              className="group block hover:opacity-75 transition-opacity"
            >
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {post.description}
              </p>
              <time className="text-sm text-gray-500 dark:text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}