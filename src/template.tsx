import { bitable, UIBuilder } from "@lark-base-open/js-sdk";
import { UseTranslationResponse } from 'react-i18next';

export default async function(uiBuilder: UIBuilder, { t }: UseTranslationResponse<'translation', undefined>) {
  uiBuilder.markdown(`
  > 欢迎使用 UIBuilder，你可以在 \`uiBuilder.markdown\` 或者 \`uiBuilder.text\` 中输出交互内容  
  > 功能演示&反馈请查阅 👉 [使用指南](https://feishu.feishu.cn/docx/OHxZdBQrVo5uudx1moIcL5jcn3c)
  `);
  uiBuilder.form((form) => ({
    formItems: [
      form.tableSelect('table', { label: '选择数据表' }),
      form.viewSelect('view', { label: '选择视图', sourceTable: 'table' }),
      form.fieldSelect('field', { label: '选择字段', sourceTable: 'table', multiple: true }),
      form.input('text', { label: '输入文本', defaultValue: '文本默认值' }),
      form.inputNumber('number', { label: '输入数字', defaultValue: 28 }),
      form.textArea('textArea', { label: '输入多行文本' }),
      form.checkboxGroup('checkbox', { label: '选择水果', options: ['Apple', 'Orange'], defaultValue: ['Apple'] }),
      form.select('select', { label: '下拉选择器', options: [{ label: 'Apple', value: 'Apple' }, { label: 'Orange', value: 'Orange' }], defaultValue: 'Apple' }),
    ],
    buttons: ['确定', '取消'],
  }), async ({ key, values }) => {
    const { table, view, field, text, number, textArea, checkbox, select } = values;
    
    uiBuilder.markdown(`你点击了**${key}**按钮`);

    // Get the current selection
    const selection = await bitable.base.getSelection();
    // Find current table by tableId
    const tableSelection = await bitable.base.getTableById(selection?.tableId!);
    // Get table's field meta list
    const fieldMetaList = await tableSelection.getFieldMetaList();
    // Find the field with the same name as Multiline or 多行文本
    const textField = fieldMetaList.find(({ name }) => name === 'Multiline' || name === '多行文本');
    // Get all records
    const recordIdList = await tableSelection.getRecordIdList();
    
    console.log(values);
    console.log(bitable);
    console.log(selection);
    console.log(tableSelection);
  });
}