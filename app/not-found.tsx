import { ButtonLink, ButtonRow, PageIntro } from "@/components/ui";

export default function NotFound() {
  return (
    <PageIntro
      eyebrow="404"
      title="Nothing here"
      lead="This page doesn't exist, or it has moved. Start again from the home page, or look through the features."
    >
      <ButtonRow style={{ marginTop: 32, paddingBottom: "var(--section-y)" }}>
        <ButtonLink href="/" variant="primary">
          Go to the home page
        </ButtonLink>
        <ButtonLink href="/features">See the features</ButtonLink>
      </ButtonRow>
    </PageIntro>
  );
}
