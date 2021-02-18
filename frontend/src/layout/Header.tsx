import { StandardProps } from "../types/types";
import "../styles/layout/header.scss";
import { useEffect, useState } from "react";
import { companySubject } from "../rxjs/company.subject";
import { Company } from "../types";
import { useSubject } from "../hooks/useAsyncState";

type HeaderProps = {} & StandardProps;

function Header({ ...props }: HeaderProps) {
  const [company] = useSubject<Company>(null, companySubject.subject);
  return (
    <header {...props}>
      <h1>{company?.name || '...'}</h1>
    </header>
  );
}

export default Header;
