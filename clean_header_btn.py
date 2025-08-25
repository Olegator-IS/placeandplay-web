import re

def clean_header_btn_styles():
    """Очищает дублированные стили header-btn и заменяет их на объединенную версию"""
    
    # Читаем файл
    with open('public/welcome.html', 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Объединенные стили
    unified_styles = """
        /* ОБЪЕДИНЕННЫЕ СТИЛИ HEADER-BTN - ЛУЧШИЕ ЧАСТИ ИЗ ВСЕХ ВЕРСИЙ */
        .header-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            letter-spacing: 0.01em;
            position: relative;
            overflow: hidden;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        /* Анимация shimmer для всех кнопок */
        .header-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .header-btn:hover::before {
            left: 100%;
        }

        /* Primary кнопка - объединенные лучшие стили */
        .header-btn.primary {
            background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
            color: white;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            position: relative;
            overflow: hidden;
        }

        .header-btn.primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
        }

        .header-btn.primary:active {
            transform: translateY(0);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Secondary кнопка - объединенные лучшие стили */
        .header-btn.secondary {
            background: rgba(255, 255, 255, 0.8);
            color: #667eea;
            border: 2px solid transparent;
            background-clip: padding-box;
            position: relative;
            backdrop-filter: blur(10px);
        }

        /* Градиентная рамка для secondary кнопки */
        .header-btn.secondary::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask-composite: xor;
            z-index: -1;
        }

        .header-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.95);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .header-btn.secondary:active {
            transform: translateY(0);
        }

        /* Анимация при нажатии */
        .header-btn:active::before {
            left: 100%;
        }
    """
    
    # Находим все блоки стилей header-btn и заменяем их на объединенную версию
    # Паттерн для поиска всех стилей header-btn
    pattern = r'\.header-btn\s*\{[^}]*\}\s*\.header-btn\.primary\s*\{[^}]*\}\s*\.header-btn\.primary:hover\s*\{[^}]*\}\s*\.header-btn\.secondary\s*\{[^}]*\}\s*\.header-btn\.secondary:hover\s*\{[^}]*\}'
    
    # Заменяем все найденные блоки на объединенную версию
    content = re.sub(pattern, unified_styles.strip(), content, flags=re.DOTALL)
    
    # Также удаляем отдельные дублированные стили
    # Удаляем все .header-btn.primary и .header-btn.secondary стили, которые не входят в объединенный блок
    content = re.sub(r'\.header-btn\.primary\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.secondary\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.primary:hover\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.secondary:hover\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.primary:active\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.secondary:active\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.primary::before\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.secondary::before\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.primary::after\s*\{[^}]*\}', '', content)
    content = re.sub(r'\.header-btn\.secondary::after\s*\{[^}]*\}', '', content)
    
    # Удаляем пустые строки
    lines = content.split('\n')
    cleaned_lines = []
    for line in lines:
        if line.strip():
            cleaned_lines.append(line)
        elif cleaned_lines and cleaned_lines[-1].strip():
            cleaned_lines.append(line)
    
    content = '\n'.join(cleaned_lines)
    
    # Записываем обратно в файл
    with open('public/welcome.html', 'w', encoding='utf-8') as file:
        file.write(content)
    
    print("✅ Стили header-btn успешно объединены и очищены от дубликатов!")

if __name__ == "__main__":
    clean_header_btn_styles() 