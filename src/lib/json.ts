export const exportJson = (jsonData: object[], filename: string) => {
  const stringifiedJson = JSON.stringify(jsonData, null, 2);

  const blob = new Blob([stringifiedJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
