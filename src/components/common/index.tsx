export function TitleStyles(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={"text-4xl font-bold text-center " + props.className}
    />
  );
}
