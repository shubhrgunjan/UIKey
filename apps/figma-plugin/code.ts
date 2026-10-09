figma.showUI(__html__, { width: 300, height: 200 });

figma.ui.onmessage = msg => {
  if (msg.type === 'export') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("Please select a frame first.");
      return;
    }
    
    const extractNodeData = (node: any) => {
      const data: any = {
        name: node.name,
        type: node.type,
      };
      
      if (node.fills && Array.isArray(node.fills)) {
        data.fills = node.fills;
      }
      if (node.layoutMode) {
        data.layoutMode = node.layoutMode;
        data.primaryAxisSizingMode = node.primaryAxisSizingMode;
        data.counterAxisSizingMode = node.counterAxisSizingMode;
      }
      
      if (node.children) {
        data.children = node.children.map((child: any) => extractNodeData(child));
      }
      return data;
    };

    const payload = selection.map(node => extractNodeData(node));
    console.log("Mock JSON Payload:", JSON.stringify(payload, null, 2));
    
    figma.notify("Exported selected frames (check console)");
  }
};
