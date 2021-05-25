import React from 'react';
interface Props {
    title?: string;
    onClean?(): void;
    onExplorer?(explorer: string): void;
    showExplorer: boolean;
}
declare class Layout extends React.Component<Props> {
    changeUrl(): void;
    render(): JSX.Element;
}
export default Layout;
