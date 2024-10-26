export function TitleStyles(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={"text-4xl font-bold text-center " + props.className}
    />
  );
}

export function SubtitleStyles(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 {...props} className="text-center" />
  );
}