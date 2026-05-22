import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BlogPostForm from "@/app/components/BlogPostForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title_en, title_vi, excerpt_en, excerpt_vi, category, content_en, content_vi, image, published",
    )
    .eq("id", id)
    .single();

  if (!post) notFound();

  return <BlogPostForm post={post} />;
}
